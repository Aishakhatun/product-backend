// Since the environment is modern (Node.js v24.13.0), standard fetch is globally available.
// We will use native fetch directly.

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING E-COMMERCE INTEGRATION FLOW TESTS ===\n');

  try {
    // 1. Register a new test customer
    const customerEmail = `tester_${Date.now()}@nrgandhi.com`;
    const customerPassword = 'testerpassword123';
    console.log(`1. Registering new customer: ${customerEmail}...`);
    
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Test Buyer',
        email: customerEmail,
        password: customerPassword,
        phone: '9999888877',
        address: {
          street: '15, Heritage Road',
          city: 'Himatnagar',
          state: 'Gujarat',
          pincode: '383001',
          country: 'India'
        }
      })
    });
    
    const regData = await regRes.json();
    if (!regData.success) {
      throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    }
    const customerToken = regData.token;
    const customerId = regData._id;
    console.log(`✔ Customer registered successfully! ID: ${customerId}\n`);

    // 2. Login as Admin
    console.log('2. Authenticating as Admin (admin@nrgandhi.com)...');
    const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nrgandhi.com',
        password: 'admin123'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    if (!adminLoginData.success) {
      throw new Error(`Admin authentication failed: ${JSON.stringify(adminLoginData)}`);
    }
    const adminToken = adminLoginData.token;
    console.log('✔ Admin authenticated successfully!\n');

    // 3. Browse Products & Locate Akarkara Root 50g variant
    console.log('3. Searching for "Akarkara" root via public API...');
    const prodRes = await fetch(`${API_URL}/products?search=Akarkara`);
    const prodData = await prodRes.json();
    if (!prodData.success || prodData.data.length === 0) {
      throw new Error(`Could not find Akarkara Root: ${JSON.stringify(prodData)}`);
    }
    
    const akarkara = prodData.data[0];
    const variant50g = akarkara.variants.find(v => v.grams === 50);
    if (!variant50g) {
      throw new Error('50g variant of Akarkara Root is missing.');
    }
    const initialStock = variant50g.stock;
    console.log(`✔ Found Akarkara Root!`);
    console.log(`  - 50g variant Price: ₹${variant50g.price}`);
    console.log(`  - Current stock level: ${initialStock} units\n`);

    // 4. Create an Order (User Cart & Checkout Simulation)
    console.log('4. Simulating Cart Checkout for 2 units of 50g variant (Subtotal = ₹440)...');
    const checkoutRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        items: [{
          product: akarkara._id,
          name: akarkara.name,
          grams: 50,
          price: variant50g.price,
          quantity: 2
        }],
        billingDetails: {
          firstName: 'Test',
          lastName: 'Buyer',
          address: '15, Heritage Road',
          city: 'Himatnagar',
          state: 'Gujarat',
          pincode: '383001',
          phone: '9999888877',
          email: customerEmail
        },
        paymentMethod: 'online',
        paymentDetails: {
          transactionId: 'TXN_SIMULATED_SUCCESS_998877',
          paymentGateway: 'Razorpay (Simulation)'
        }
      })
    });
    
    const checkoutData = await checkoutRes.json();
    if (!checkoutData.success) {
      throw new Error(`Order placement failed: ${JSON.stringify(checkoutData)}`);
    }
    const order = checkoutData.data;
    console.log(`✔ Order placed successfully! Order ID: ${order._id}`);
    console.log(`  - Billing Name: ${order.billingDetails.firstName} ${order.billingDetails.lastName}`);
    console.log(`  - Shipping Fee: ₹${order.shippingFee} (Subtotal ₹440 < ₹1000 threshold)`);
    console.log(`  - Total Paid: ₹${order.totalAmount}\n`);

    // 5. Verify Stock Deduction in Database
    console.log('5. Verifying stock deduction for Akarkara Root 50g variant...');
    const verifyProdRes = await fetch(`${API_URL}/products/${akarkara._id}`);
    const verifyProdData = await verifyProdRes.json();
    const updatedVariant = verifyProdData.data.variants.find(v => v.grams === 50);
    console.log(`  - Initial Stock: ${initialStock}`);
    console.log(`  - New Stock: ${updatedVariant.stock}`);
    if (updatedVariant.stock !== initialStock - 2) {
      throw new Error(`Stock deduction failed! Expected ${initialStock - 2}, got ${updatedVariant.stock}`);
    }
    console.log('✔ Database stock successfully deducted by 2 units!\n');

    // 6. Security Check: Block unauthorised user from fetching all orders
    console.log('6. Security Check: Customer attempting to fetch all admin order records...');
    const hackRes = await fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const hackData = await hackRes.json();
    console.log(`  - API Response status: ${hackRes.status}`);
    console.log(`  - API Response message: ${hackData.message}`);
    if (hackRes.status !== 403) {
      throw new Error('Security Breach: Public customer was allowed to access admin orders route!');
    }
    console.log('✔ Access Denied (403 Forbidden) correctly blocked customer role!\n');

    // 7. Admin Order Management: Update order status to shipped/paid
    console.log('7. Admin Order Management: Updating order shipment status to "shipped"...');
    const updateRes = await fetch(`${API_URL}/orders/${order._id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        orderStatus: 'shipped',
        paymentStatus: 'paid'
      })
    });
    const updateData = await updateRes.json();
    if (!updateData.success) {
      throw new Error(`Admin update order status failed: ${JSON.stringify(updateData)}`);
    }
    console.log('✔ Shipment status successfully updated to "shipped" and payment status marked as "paid"!\n');

    // 8. User Dashboard verification: Verify customer views updated order details
    console.log('8. User Dashboard: Customer checking updated order status...');
    const userOrderRes = await fetch(`${API_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const userOrderData = await userOrderRes.json();
    const fetchedOrder = userOrderData.data.find(o => o._id === order._id);
    console.log(`  - Order Status in Customer Profile: "${fetchedOrder.orderStatus}"`);
    console.log(`  - Payment Status in Customer Profile: "${fetchedOrder.paymentStatus}"`);
    if (fetchedOrder.orderStatus !== 'shipped' || fetchedOrder.paymentStatus !== 'paid') {
      throw new Error('Status update did not synchronize to user view.');
    }
    console.log('✔ Customer dashboard successfully synchronized with admin updates!\n');

    console.log('=== ALL INTEGRATION FLOW TESTS PASSED SUCCESSFULLY! ===');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST RUN FAILED!');
    console.error(error.message || error);
    process.exit(1);
  }
}

// Wait for a second for the dev server to start
setTimeout(runTests, 1000);
