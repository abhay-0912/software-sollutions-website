// @ts-nocheck
import { Resend } from "npm:resend@4.0.0";

type LeadPayload = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string;
  budget: string;
  timeline: string;
  message: string;
  referral_source: string | null;
  status: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await request.json()) as LeadPayload;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const resend = new Resend(resendApiKey);

    const subject = `New lead from ${payload.name} - ${payload.service_interest}`;

    const html = `
      <h2>New Lead Enquiry</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Phone:</strong> ${payload.phone ?? "Not provided"}</p>
      <p><strong>Company:</strong> ${payload.company ?? "Not provided"}</p>
      <p><strong>Service:</strong> ${payload.service_interest}</p>
      <p><strong>Budget:</strong> ${payload.budget}</p>
      <p><strong>Timeline:</strong> ${payload.timeline}</p>
      <p><strong>Referral:</strong> ${payload.referral_source ?? "Not provided"}</p>
      <p><strong>Status:</strong> ${payload.status}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
    `;

    const { error } = await resend.emails.send({
      from: "Abaay Tech <no-reply@abaay.tech>",
      to: ["absrivastava999@gmail.com"],
      subject,
      html,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
