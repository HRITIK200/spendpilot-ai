import express from "express";
import { Resend } from "resend";
import { z } from "zod";
import Report from "../models/Report.js";
import { auditWithGemini } from "../utils/geminiAuditor.js";
import { validateRequest } from "../middleware/validation.js";
import { reportSchema } from "../middleware/schemas.js";
import { verifyToken, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

// 1. CREATE REPORT (Guest or Authenticated User)
router.post("/", optionalAuth, validateRequest(reportSchema), async (req, res) => {
  try {
    let reportData;

    // Server-side audit generation if raw tools list is supplied
    if (req.body.tools && Array.isArray(req.body.tools)) {
      reportData = await auditWithGemini(req.body.tools);
    } else {
      reportData = req.body;
    }

    // Attach user metadata if request was authenticated
    if (req.user) {
      reportData.userId = req.user.id;
      if (req.user.company && !reportData.company) {
        reportData.company = req.user.company;
      }
    }

    const report = await Report.create(reportData);
    res.status(201).json(report);
  } catch (error) {
    console.error("Report creation failed:", error);
    res.status(500).json({
      message: "Failed to create report",
    });
  }
});

// 2. GET USER AUDIT HISTORY (Authenticated Cloud Sync)
router.get("/user/history", verifyToken, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reports);
  } catch (error) {
    console.error("Failed to fetch user report history:", error);
    res.status(500).json({ message: "Failed to retrieve audit history." });
  }
});

// 3. GET REPORT BY ID (Public or Private)
router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch report",
    });
  }
});

const emailSchema = z.object({
  recipientEmail: z.string().email("A valid recipient email is required").trim().toLowerCase(),
  senderName: z.string().optional().default("FinOps Lead"),
  notes: z.string().optional().default(""),
});

// 4. EMAIL REPORT TO FINANCE / EXECUTIVE (Resend API)
router.post("/:id/email", validateRequest(emailSchema), async (req, res) => {
  try {
    const { recipientEmail, senderName, notes } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Audit report not found." });
    }

    const publicUrl = `https://spendpilot-ai-sandy.vercel.app/report/${report._id}`;
    const resend = getResendClient();

    const toolsSummaryHtml = (report.auditedTools || [])
      .map(
        (t) => `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 12px; font-weight: bold; color: #f8fafc;">${t.tool}</td>
          <td style="padding: 10px 12px; color: #94a3b8;">${t.plan} (${t.seats || 1} seats)</td>
          <td style="padding: 10px 12px; color: #38bdf8;">${t.optimizedPlan}</td>
          <td style="padding: 10px 12px; font-weight: bold; color: #34d399;">$${t.monthlySavings || 0}/mo</td>
        </tr>
      `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #030712; color: #f8fafc; padding: 24px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid #1e293b; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <div style="margin-bottom: 24px;">
            <span style="background: rgba(16, 185, 129, 0.1); color: #34d399; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.2);">SpendPilot AI • Executive FinOps Summary</span>
            <h1 style="color: #ffffff; font-size: 24px; margin: 12px 0 6px 0; font-weight: 800;">AI SaaS Infrastructure Cost Audit</h1>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">Prepared by <strong>${senderName}</strong> for organizational budget review.</p>
          </div>

          ${
            notes
              ? `<div style="background: #1e293b; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; color: #cbd5e1; font-size: 13px; font-style: italic;">"${notes}"</div>`
              : ""
          }

          <!-- METRICS GRID -->
          <div style="display: table; width: 100%; margin-bottom: 28px;">
            <div style="display: table-cell; width: 33%; background: #131d33; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; text-align: center;">
              <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 600;">Monthly Savings</div>
              <div style="color: #34d399; font-size: 24px; font-weight: 800; margin-top: 4px;">$${report.totalMonthlySavings}</div>
            </div>
            <div style="display: table-cell; width: 3%;">&nbsp;</div>
            <div style="display: table-cell; width: 33%; background: #131d33; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; text-align: center;">
              <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 600;">Annual Savings</div>
              <div style="color: #38bdf8; font-size: 24px; font-weight: 800; margin-top: 4px;">$${report.totalAnnualSavings}</div>
            </div>
            <div style="display: table-cell; width: 3%;">&nbsp;</div>
            <div style="display: table-cell; width: 33%; background: #131d33; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; text-align: center;">
              <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 600;">Efficiency Score</div>
              <div style="color: #c084fc; font-size: 24px; font-weight: 800; margin-top: 4px;">${report.optimizationScore}/100</div>
            </div>
          </div>

          <!-- TOOL TABLE -->
          <h3 style="color: #f8fafc; font-size: 15px; margin: 0 0 12px 0;">Audited AI Infrastructure</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 28px; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid #334155; color: #64748b; text-transform: uppercase; font-size: 10px;">
                <th style="padding: 8px 12px;">Tool</th>
                <th style="padding: 8px 12px;">Current Tier</th>
                <th style="padding: 8px 12px;">Recommended</th>
                <th style="padding: 8px 12px;">Savings</th>
              </tr>
            </thead>
            <tbody>
              ${toolsSummaryHtml}
            </tbody>
          </table>

          <!-- CTA BUTTON -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="${publicUrl}" style="background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);">
              View Complete Interactive Audit Report &rarr;
            </a>
            <p style="color: #64748b; font-size: 11px; margin-top: 14px;">This report is powered by SpendPilot AI — Enterprise AI SaaS Cost Optimization.</p>
          </div>

        </div>
      </body>
      </html>
    `;

    if (!resend) {
      console.warn("RESEND_API_KEY missing. Simulating email dispatch to:", recipientEmail);
      return res.json({
        message: `Executive report preview generated (mock delivery to ${recipientEmail} because Resend API key is unconfigured).`,
        simulated: true,
      });
    }

    const { error: resendError } = await resend.emails.send({
      from: "SpendPilot AI <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Executive AI Spend Audit: Projected $${report.totalAnnualSavings}/yr Savings Found`,
      html: emailHtml,
    });

    if (resendError) {
      console.error("Resend API delivery error:", resendError);
      return res.status(502).json({
        message: `Email dispatch failed: ${resendError.message}`,
      });
    }

    res.json({
      message: `Executive audit report successfully sent to ${recipientEmail}!`,
    });
  } catch (error) {
    console.error("Email delivery failed:", error);
    res.status(500).json({ message: "Failed to dispatch executive email." });
  }
});

export default router;