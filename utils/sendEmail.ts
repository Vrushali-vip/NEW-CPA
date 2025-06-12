import nodemailer from 'nodemailer';

export async function sendInsuranceEmail(
  to: string,
  data: { name: string; policyNumber: string; startDate: string; endDate: string }
) {
  console.log('sendInsuranceEmail called with:', to, data);

  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
    tls: {
      rejectUnauthorized: false,
    },
    logger: true,
    debug: true,
  });

  // Verify SMTP connection configuration
  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP verification failed:', error);
        reject(error);
      } else {
        console.log('✅ SMTP server is ready');
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: `"Compass Point" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Insurance Policy Details',
    html: `
      <p>Hi ${data.name},</p>
      <p>Thank you for purchasing insurance.</p>
      <p><strong>Policy Number:</strong> ${data.policyNumber}</p>
      <p><strong>Start Date:</strong> ${data.startDate}</p>
      <p><strong>End Date:</strong> ${data.endDate}</p>
    `,
  };

  console.log('📤 Sending email with details:', mailOptions);

  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Email sent:', info.response);

  return info;
}
