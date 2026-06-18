let transporterInstance = null;

const getTransporter = () => {
  if (transporterInstance) return transporterInstance;

  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (hasSmtpConfig) {
    const nodemailer = require('nodemailer');
    transporterInstance = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      pool: true, // Enable connection pooling
      maxConnections: 3,
      maxMessages: 100,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporterInstance;
};

exports.sendEmail = async (req, res) => {
  try {
    let { type, name, email, phone, company, service, budget, timeline, message } = req.body;

    // Input sanitization & normalization
    name = (name || '').trim();
    email = (email || '').trim().toLowerCase();
    phone = (phone || '').trim();
    company = (company || '').trim();
    service = (service || '').trim();
    budget = (budget || '').trim();
    timeline = (timeline || '').trim();
    message = (message || '').trim();

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const emailTo = process.env.EMAIL_TO || 'support@zetta-web.in';
    let subject = '';
    let html = '';

    if (type === 'booking') {
      subject = `New Booking Request from ${name}`;
      html = `
        <h2>New Project Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service Required:</strong> ${service || 'N/A'}</p>
        <p><strong>Estimated Budget:</strong> ${budget || 'N/A'}</p>
        <p><strong>Desired Timeline:</strong> ${timeline || 'N/A'}</p>
        <p><strong>Project Details:</strong></p>
        <p>${message || 'N/A'}</p>
      `;
    } else {
      subject = `New Contact Form Message from ${name}`;
      html = `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'N/A'}</p>
      `;
    }

    const transporter = getTransporter();

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"${name}" <${process.env.SMTP_USER}>`,
          replyTo: email,
          to: emailTo,
          subject: subject,
          html: html,
        });

        console.log(`Email successfully sent via SMTP to ${emailTo}`);
        return res.json({ success: true, message: 'Email sent successfully' });
      } catch (smtpError) {
        console.error('SMTP sending failed, falling back to console log:', smtpError.message);
      }
    }

    // Fallback console log for local development
    console.log('--- DEVELOPMENT EMAIL LOG ---');
    console.log(`To: ${emailTo}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html.replace(/<[^>]*>/g, '').trim()}`);
    console.log('------------------------------');

    return res.json({
      success: true,
      message: 'Email logged to server console (SMTP not configured or failed)',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
