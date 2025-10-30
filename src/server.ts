import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Email API endpoint
 */
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    // Validate phone number: must start with 0 and have exactly 10 digits
    const phoneRegex = /^0\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'מספר טלפון חייב להתחיל ב-0 ולהכיל בדיוק 10 ספרות'
      });
    }

    // Validate other required fields
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'שם חייב להכיל לפחות 2 תווים'
      });
    }

    if (!message || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'הודעה חייבת להכיל לפחות 5 תווים'
      });
    }

    // Configure your email transport
    // For production, use your actual SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
      port: parseInt(process.env['SMTP_PORT'] || '587'),
      secure: false,
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PASS'],
      },
    });

    console.log('email user: ', process.env['EMAIL_USER']);


    // Email content
    const mailOptions = {
      from: process.env['EMAIL_USER'],
      to: 'Joelkr@gmail.com', // Recipient email - where contact form messages are sent
      subject: `הודעה חדשה מ ${name}`,
      text: `
Name: ${name}
Phone: ${phone}
Message: ${message}
      `,
      html: `
  <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
    <h1 style="font-size: 22px; color: #222;">התקבלה פנייה מהאתר</h1>
    <p><strong>שם הלקוח:</strong> ${name}</p>
    <p><strong>מספר טלפון:</strong> 
      <a href="tel:${phone}" style="color: #25d366; text-decoration: none; font-weight: bold;">
        ${phone}
      </a>
    </p>
    <p><strong>תוכן ההודעה:</strong> ${message.replace(/\n/g, '<br />')}</p>
  </div>`


      ,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
