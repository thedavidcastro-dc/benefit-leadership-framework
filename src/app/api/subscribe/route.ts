import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, organization } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: 'BENEFIT Framework <onboarding@resend.dev>',
      to: 'david.castro@allianceofleadershipfellows.org',
      subject: `New BENEFIT Advocate: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
            New BENEFIT Advocate Sign-Up
          </h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0;"><strong>Organization:</strong> ${organization || 'Not provided'}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This person has committed to leading with the BENEFIT values: Benevolence, Empathy, 
            Nonviolence, Equity, Flourishing, Integrity, and Transparency.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <p style="color: #999; font-size: 12px;">
            Sent from the BENEFIT Leadership Ethics Framework website
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to send email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
