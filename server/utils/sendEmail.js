import { Resend } from "resend";
import nodemailer from "nodemailer";

const RESEND_SANDBOX_OWNER = "palhritik18@gmail.com";

/**
 * Generates modern executive HTML template for SpendPilot AI subscribers.
 */
const buildSubscriberHtml = (email, company) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SpendPilot AI - Audit Updates</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #030712; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- HEADER -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; background: linear-gradient(180deg, #131d33 0%, #0f172a 100%); border-bottom: 1px solid #1e293b;">
              <span style="display: inline-block; background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(59, 130, 246, 0.3);">
                SpendPilot AI • FinOps Intelligence
              </span>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 16px 0 8px 0; letter-spacing: -0.02em;">
                Subscription Confirmed!
              </h1>
              <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.5;">
                You are now subscribed to automated AI SaaS optimization updates and license benchmarks${company ? ` for <strong>${company}</strong>` : ""}.
              </p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding: 28px 32px;">
              <h2 style="color: #f8fafc; font-size: 16px; margin: 0 0 14px 0;">What you will receive:</h2>
              <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong style="color: #38bdf8;">Pricing Shift Alerts:</strong> Up-to-date tracking of tier price hikes and seat model changes for OpenAI, Claude, Cursor, Copilot, and Windsurf.</li>
                <li><strong style="color: #34d399;">Redundancy & Overlap Audits:</strong> Best practices to eliminate duplicate developer and conversational AI licenses.</li>
                <li><strong style="color: #c084fc;">What-If Budget Forecasting:</strong> Early access to interactive scenario tools to model team contractions or expansion.</li>
              </ul>

              <div style="background-color: #1e293b; border-radius: 12px; padding: 16px; margin: 24px 0 20px 0; border-left: 4px solid #3b82f6;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.5;">
                  Subscriber Email: <span style="color: #ffffff; font-weight: 600;">${email}</span><br/>
                  ${company ? `Company: <span style="color: #ffffff; font-weight: 600;">${company}</span><br/>` : ""}
                  Status: <span style="color: #34d399; font-weight: 600;">Active Subscriber</span>
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin: 28px 0 12px 0;">
                <a href="https://spendpilot-ai-sandy.vercel.app/audit" style="background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 12px; display: inline-block;">
                  Run a New Free Audit &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0b1120; border-top: 1px solid #1e293b; text-align: center;">
              <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} SpendPilot AI. Built for engineering teams, FinOps managers, and CFOs.<br/>
                If you did not request this, you can safely disregard this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendLeadEmail = async (email, company = "") => {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const htmlContent = buildSubscriberHtml(normalizedEmail, company);

  // 1. Check if SMTP configuration is provided (e.g. Gmail App Password, Mailgun, SendGrid)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"SpendPilot AI" <${process.env.SMTP_USER}>`,
        to: normalizedEmail,
        subject: "Your SpendPilot AI Optimization & FinOps Updates",
        html: htmlContent,
      });

      console.log("Email dispatched successfully via SMTP:", info.messageId);
      return { success: true, messageId: info.messageId, provider: "smtp" };
    } catch (smtpErr) {
      console.error("SMTP delivery failed, falling back to Resend:", smtpErr.message);
    }
  }

  // 2. Resend Delivery Flow
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Attempt primary delivery to user
      const { data, error } = await resend.emails.send({
        from: "SpendPilot AI <onboarding@resend.dev>",
        to: normalizedEmail,
        subject: "Your SpendPilot AI Optimization & FinOps Updates",
        html: htmlContent,
      });

      if (!error && data) {
        console.log(`Email successfully delivered to ${normalizedEmail} via Resend. ID:`, data.id);
        return { success: true, messageId: data.id, provider: "resend" };
      }

      console.warn("Resend delivery reported error/restriction:", error);

      // If Resend gave 403 sandbox restriction because recipient is not the account owner:
      if (error && (error.statusCode === 403 || error.name === "validation_error")) {
        // Send notification to account owner so lead is never lost!
        try {
          await resend.emails.send({
            from: "SpendPilot AI <onboarding@resend.dev>",
            to: RESEND_SANDBOX_OWNER,
            subject: `[SpendPilot AI Lead] New subscriber: ${normalizedEmail}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
                <h2 style="color: #2563eb;">New Audit Updates Subscriber Captured!</h2>
                <p><strong>Subscriber Email:</strong> ${normalizedEmail}</p>
                <p><strong>Company:</strong> ${company || "Not provided"}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="color: #64748b; font-size: 12px;">
                  <em>Note: Resend is operating in sandbox mode with <code>onboarding@resend.dev</code>. In sandbox mode, Resend permits outbound test emails only to your account owner address (<code>${RESEND_SANDBOX_OWNER}</code>). To enable direct automated delivery to any recipient inbox, verify a custom domain at resend.com/domains or configure SMTP credentials in server/.env.</em>
                </p>
              </div>
            `,
          });
          console.log(`Lead notification dispatched to admin (${RESEND_SANDBOX_OWNER})`);
        } catch (adminErr) {
          console.error("Failed to dispatch admin notification:", adminErr);
        }

        return {
          success: false,
          isSandbox: true,
          sandboxOwner: RESEND_SANDBOX_OWNER,
          message: error.message,
        };
      }

      return {
        success: false,
        error: error ? error.message : "Unknown email delivery failure",
      };
    } catch (resendException) {
      console.error("Resend execution error:", resendException);
      return {
        success: false,
        error: resendException.message,
      };
    }
  }

  // 3. Fallback when no email keys configured
  console.warn("No active email provider configured (missing RESEND_API_KEY and SMTP)");
  return {
    success: false,
    simulated: true,
    message: "Email dispatch simulated (no provider configured)",
  };
};