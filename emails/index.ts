import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY?.startsWith("re_")
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev"

export async function sendEmail(to: string, subject: string, html: string) {
  if (resend) {
    const { error } = await resend.emails.send({
      from: `TikkunKaruna <${fromEmail}>`,
      to,
      subject,
      html,
    })
    if (error) console.error("[Resend]", error)
  } else {
    console.log(`[Email] Sending to ${to}: ${subject}`)
  }
}
