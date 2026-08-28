const Contact = require('../models/contact.model');
const nodemailer = require('nodemailer');

// Helper to send email notification
const sendContactEmail = async (contactData) => {
  try {
    // Configure transporter (using SMTP env vars or fallback)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER || 'support@aishahub.com',
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || 'emailpasswordplaceholder',
      },
    });

    const mailOptions = {
      from: `"Aisha Hub Contact Form" <${process.env.SMTP_USER || 'support@aishahub.com'}>`,
      to: process.env.ADMIN_CONTACT_EMAIL || 'support@aishahub.com',
      subject: `New Customer Inquiry: ${contactData.subject || 'General Question'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1c1917; max-width: 600px; margin: 0 auto; border: 1px solid #e7e5e4; border-radius: 8px;">
          <h2 style="color: #064e3b; margin-top: 0;">📩 New Contact Us Submission</h2>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${contactData.subject || 'General Inquiry'}</p>
          <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 15px 0;" />
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f4; padding: 15px; border-radius: 6px; font-size: 0.95rem; line-height: 1.5;">
            ${contactData.message.replace(/\n/g, '<br/>')}
          </div>
          <p style="font-size: 0.8rem; color: #78716c; margin-top: 20px;">
            Submitted via Aisha Hub Storefront on ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    };

    // Attempt sending email asynchronously
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('[Contact Email Notification Note]:', err.message);
      } else {
        console.log('[Contact Email Sent Successfully]:', info.response);
      }
    });
  } catch (err) {
    console.error('[Contact Email Setup Exception]:', err.message);
  }
};

// @desc    Submit contact us inquiry & send email notification
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message.',
      });
    }

    // 1. Save contact message to MongoDB database
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // 2. Dispatch email notification in background
    sendContactEmail(contact);

    // 3. Return success response
    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. Our team will contact you shortly.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    next(error);
  }
};
