# Email Configuration Setup

The contact form now sends emails directly without opening Gmail!

## 📧 Setup Instructions

### Step 1: Install Dependencies

Already done! `nodemailer` is installed.

### Step 2: Create Email Credentials

#### For Gmail:

1. **Enable 2-Step Verification**

   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or Other)
   - Click "Generate"
   - Copy the 16-character password

### Step 3: Create `.env` File

Create a file named `.env` in the project root:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Replace:**

- `your-email@gmail.com` → Your actual Gmail address
- `your-16-character-app-password` → The app password from step 2

### Step 4: Update Recipient Email (Optional)

In `src/server.ts`, change the recipient email if needed:

```typescript
to: 'joe@repairman.co.il', // Change this to your email
```

## 🚀 How It Works

1. User fills out the contact form
2. Form data is sent to `/api/send-email` endpoint
3. Server uses nodemailer to send the email
4. User sees success/error message

## 📝 Email Format

You'll receive emails with:

- **Subject**: "New Contact Form Message from [Name]"
- **Body**: Name, Phone Number, and Message in HTML format

## ✅ Testing

1. Start the dev server: `npm start`
2. Go to `/electrician`
3. Fill out the contact form
4. Click "Send"
5. Check your email inbox!

## 🔒 Security

- `.env` file is in `.gitignore` (never committed)
- Credentials are loaded from environment variables
- SMTP credentials are secure

## 🌐 Production Deployment

### For Production:

Set environment variables in your hosting platform:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Heroku**: Settings → Config Vars

Add:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🔧 Alternative Email Services

### Using SendGrid:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Using Mailgun:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASS=your-mailgun-password
```

## ⚠️ Important Notes

1. **Don't commit .env** - It contains sensitive credentials
2. **Use App Passwords** - Never use your actual Gmail password
3. **Rate Limits** - Gmail has daily sending limits (~500 emails/day)
4. **For production** - Consider using dedicated email services like SendGrid or AWS SES

## 🐛 Troubleshooting

### Email not sending?

1. Check `.env` file exists and has correct credentials
2. Verify app password is correct (no spaces)
3. Check console for error messages
4. Ensure SMTP settings are correct for your provider

### "Invalid login" error?

- Make sure you're using an App Password, not your regular password
- Verify 2-Step Verification is enabled on Gmail

## 📞 Support

If you need help:

1. Check the browser console for errors
2. Check the server console for detailed error messages
3. Verify your email credentials are correct

---

**Status**: ✅ Email sending is configured and ready to use!
