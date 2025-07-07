import { corsHeaders } from '../_shared/cors.ts'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  roomCount?: string
  message: string
  privacyConsent: boolean
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse the request body
    const formData: ContactFormData = await req.json()

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message || !formData.privacyConsent) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the Resend API key from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'Email service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare email content
    const emailSubject = `New Demo Request from ${formData.name}`
    const emailHtml = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
      ${formData.company ? `<p><strong>Hotel/Company:</strong> ${formData.company}</p>` : ''}
      ${formData.roomCount ? `<p><strong>Number of Rooms:</strong> ${formData.roomCount}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${formData.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Privacy consent: ${formData.privacyConsent ? 'Yes' : 'No'}</small></p>
      <p><small>Submitted at: ${new Date().toISOString()}</small></p>
    `

    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ELVIRA Contact Form <no-reply@elviradc.com>',
        to: ['info@elviradc.com'],
        subject: emailSubject,
        html: emailHtml,
        reply_to: formData.email,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Resend API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: emailResult.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})