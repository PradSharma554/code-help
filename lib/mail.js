import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const pass = process.env.GMAIL_PASS?.replace(/\s+/g, "");
    console.log(`[Mail Debug] User: ${process.env.GMAIL_USER}`);
    console.log(`[Mail Debug] Pass Length: ${pass?.length || 0}`);
    console.log(`[Mail Debug] Pass starts with: ${pass?.substring(0, 2)}***`);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: pass, 
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    if (error.responseCode === 534) {
      throw new Error(
        "Gmail requires an App Password because 2-Step Verification is enabled. Please generate one at https://myaccount.google.com/apppasswords"
      );
    }
    throw new Error("Error sending email");
  }
};
