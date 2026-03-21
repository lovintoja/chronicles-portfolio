import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

interface ContactRequestBody {
  name: string
  email: string
  message: string
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(req: NextRequest) {
  let body: ContactRequestBody

  try {
    body = (await req.json()) as ContactRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { name, email, message } = body

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "Name is required." }, { status: 400 })
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  if (!isValidEmail(email.trim())) {
    return NextResponse.json({ error: "Email must be a valid email address." }, { status: 400 })
  }

  if (!message || typeof message !== "string" || message.trim() === "") {
    return NextResponse.json({ error: "Message is required." }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL_TO,
      replyTo: email.trim(),
      subject: `[Contact Form] Message from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    })
  } catch (err) {
    console.error("[contact/route] Failed to send email:", err)
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
