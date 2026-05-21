import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials are not set in env file");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AI Cold Mail Generator" <${process.env.EMAIL_USER}>`, // ✅ Sender name
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || getDefaultTemplate(options.subject, options.text), // ✅ Custom HTML support
    };

    await transporter.sendMail(mailOptions);
    // console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

// ✅ Sundar HTML Template
const getDefaultTemplate = (subject, text) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <h2 style="color: #4F46E5; margin-bottom: 10px;">AI Cold Mail Generator</h2>
      <hr style="border: none; border-top: 1px solid #eee;" />
      
      <p style="color: #333; font-size: 16px; margin-top: 20px;">${text}</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
      <p style="color: #999; font-size: 12px;">
       Kindly Ignore! If this request does not belongs to you.
      </p>

    </div>
  </body>
</html>
`;

export default sendEmail;
