import nodemailer from "nodemailer"

export async function sendEmail(to: string | string[], subject: string, content: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.improvmx.com',
    port: "587",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as any)

  // Send the email
  const res = await transporter.sendMail({
    from: 'support@broccoli.ngo',
    to,
    subject,
    html: content,
  })
  return res
}