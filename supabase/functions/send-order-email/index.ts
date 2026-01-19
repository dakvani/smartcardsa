import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  to: string;
  orderNumber: string;
  status: "processing" | "shipped" | "delivered";
  customerName: string;
}

const getEmailContent = (status: string, orderNumber: string, customerName: string) => {
  const statusMessages = {
    processing: {
      subject: `Order ${orderNumber} is being processed`,
      heading: "Your order is being processed! 🎉",
      message: "We've received your order and our team is preparing your custom NFC products. You'll receive another email once your order ships.",
    },
    shipped: {
      subject: `Order ${orderNumber} has shipped`,
      heading: "Your order is on its way! 📦",
      message: "Great news! Your custom NFC products have been shipped and are on their way to you. You can expect delivery within 3-5 business days.",
    },
    delivered: {
      subject: `Order ${orderNumber} has been delivered`,
      heading: "Your order has arrived! ✨",
      message: "Your custom NFC products have been delivered. We hope you love them! If you have any questions, feel free to reach out to our support team.",
    },
  };

  const content = statusMessages[status as keyof typeof statusMessages] || statusMessages.processing;

  return {
    subject: content.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">SmartCard NFC</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">${content.heading}</h2>
            <p style="color: #4b5563;">Hi ${customerName},</p>
            <p style="color: #4b5563;">${content.message}</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Order Number</p>
              <p style="margin: 5px 0 0; color: #1f2937; font-weight: 600; font-size: 18px;">${orderNumber}</p>
            </div>
            <p style="color: #4b5563; font-size: 14px;">Thank you for choosing SmartCard NFC!</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 SmartCard NFC. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, orderNumber, status, customerName }: OrderEmailRequest = await req.json();

    if (!to || !orderNumber || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If no API key, log and return success (test mode)
    if (!RESEND_API_KEY) {
      console.log("TEST MODE - Email would be sent:", { to, orderNumber, status, customerName });
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Test mode - email logged",
          testMode: true 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailContent = getEmailContent(status, orderNumber, customerName);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SmartCard NFC <onboarding@resend.dev>",
        to: [to],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
