export type EmailMeetingData = {
  clientName: string;
  clientEmail: string;
  company?: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  meetingDate?: string;
  meetingTime?: string;
  meetUrl?: string;
};

function getProductionSiteUrl(portfolioUrl?: string): string {
  if (portfolioUrl && !portfolioUrl.includes("localhost") && !portfolioUrl.includes("mehedi.ai")) {
    return portfolioUrl.replace(/\/+$/, "");
  }
  const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "");
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("mehedi.ai")) {
    return envUrl;
  }
  return "https://mhb-aa.vercel.app";
}

/**
 * Builds a custom HTML & CSS branded email for the client.
 */
export function buildClientConfirmationHtml(data: EmailMeetingData): string {
  const formattedDate = data.meetingDate || "Scheduled Date";
  const formattedTime = data.meetingTime || "11:00 AM";
  const siteUrl = getProductionSiteUrl();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Discovery Call Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f4; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container (Middle Card) -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0c120c; border: 1px solid #233020; border-radius: 4px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.18);">
          
          <!-- Top Neon Accent Stripe -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #c8ff3d, #8aff00, #c8ff3d);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; background-color: #0e140e; border-bottom: 1px solid #1c261b;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; color: #c8ff3d; letter-spacing: 2px; text-transform: uppercase; font-family: monospace;">
                      MEHEDI · AI & AUTOMATION
                    </div>
                    <div style="font-size: 22px; font-weight: 800; color: #ffffff; margin-top: 6px; letter-spacing: -0.5px;">
                      Discovery Call Confirmed
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <div style="display: inline-block; padding: 4px 10px; background-color: rgba(200, 255, 61, 0.12); border: 1px solid rgba(200, 255, 61, 0.3); border-radius: 4px; color: #c8ff3d; font-size: 11px; font-weight: bold; font-family: monospace;">
                      GOOGLE MEET
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 32px; background-color: #0c120c;">
              <p style="font-size: 15px; line-height: 1.6; color: #d0dad0; margin: 0 0 22px 0;">
                Hi <strong style="color: #ffffff;">${data.clientName}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #a4ada0; margin: 0 0 24px 0;">
                Thank you for reaching out! Your discovery session has been placed on Google Calendar. Here are your meeting details:
              </p>

              <!-- Meeting Details Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #121912; border: 1px solid #283725; border-radius: 4px; margin-bottom: 26px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table width="100%" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="35%" style="font-size: 12px; font-family: monospace; color: #838e7f; text-transform: uppercase;">📅 Date</td>
                        <td style="font-size: 13px; font-weight: 700; color: #ffffff;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; font-family: monospace; color: #838e7f; text-transform: uppercase;">⏰ Time</td>
                        <td style="font-size: 13px; font-weight: 700; color: #c8ff3d;">${formattedTime}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; font-family: monospace; color: #838e7f; text-transform: uppercase;">⚡ Project</td>
                        <td style="font-size: 13px; color: #ffffff;">${data.projectType}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; font-family: monospace; color: #838e7f; text-transform: uppercase;">⏳ Duration</td>
                        <td style="font-size: 13px; color: #a4ada0;">45 Minutes</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Google Meet CTA Button -->
              ${
                data.meetUrl
                  ? `
              <div style="text-align: center; margin: 28px 0;">
                <a href="${data.meetUrl}" target="_blank" style="display: inline-block; background-color: #c8ff3d; color: #070a07; padding: 14px 28px; font-size: 13px; font-weight: 800; text-decoration: none; border-radius: 4px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(200, 255, 61, 0.3);">
                  📹 JOIN GOOGLE MEET ROOM &rarr;
                </a>
                <div style="margin-top: 10px; font-size: 11px; color: #717b6d; font-family: monospace;">
                  Room Link: <a href="${data.meetUrl}" style="color: #a4ada0; text-decoration: underline;">${data.meetUrl}</a>
                </div>
              </div>`
                  : ""
              }

              <!-- Client Brief Quote -->
              <div style="border-left: 3px solid #c8ff3d; background-color: #080c08; padding: 14px 16px; border-radius: 0 4px 4px 0; margin-top: 24px;">
                <div style="font-size: 10px; font-family: monospace; color: #838e7f; text-transform: uppercase; margin-bottom: 6px;">
                  Your Project Brief:
                </div>
                <div style="font-size: 12px; line-height: 1.5; color: #c2ccc0; font-style: italic;">
                  "${data.message}"
                </div>
              </div>

              <p style="font-size: 13px; line-height: 1.6; color: #838e7f; margin: 26px 0 0 0;">
                I’ll review your requirements prior to our call. If you need to reschedule or send additional documentation, simply reply directly to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #090c09; border-top: 1px solid #1c261b; text-align: center;">
              <div style="font-size: 12px; font-weight: 700; color: #ffffff;">
                Mehedi Hasan
              </div>
              <div style="font-size: 11px; color: #717b6d; margin-top: 2px;">
                AI & Automation Specialist · <a href="${siteUrl}" target="_blank" style="color: #c8ff3d; text-decoration: none;">${siteUrl.replace(/^https?:\/\//, "")}</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Builds custom HTML & CSS notification email for Mehedi (Admin).
 */
export function buildAdminNotificationHtml(data: EmailMeetingData): string {
  const siteUrl = getProductionSiteUrl();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f4; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container (Middle Card) -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0c120c; border: 1px solid #334430; border-radius: 4px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.18);">
          
          <!-- Top Alert Header -->
          <tr>
            <td style="background-color: #1a2517; padding: 20px 30px; border-bottom: 2px solid #c8ff3d;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 10px; font-weight: 800; color: #c8ff3d; letter-spacing: 2px; font-family: monospace;">
                      🚨 INCOMING LEAD TELEMETRY
                    </div>
                    <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 4px;">
                      ${data.clientName} · ${data.budget}
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 8px; background-color: #c8ff3d; color: #000000; font-size: 10px; font-weight: 900; font-family: monospace; border-radius: 4px;">
                      ${data.meetingDate ? "MEETING BOOKED" : "NEW INQUIRY"}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client & Project Details Table -->
          <tr>
            <td style="padding: 28px 30px; background-color: #0c120c;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #111711; border: 1px solid #233020; border-radius: 4px; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table width="100%" cellspacing="0" cellpadding="5">
                      <tr>
                        <td width="35%" style="font-size: 11px; font-family: monospace; color: #838e7f;">CLIENT NAME</td>
                        <td style="font-size: 13px; font-weight: bold; color: #ffffff;">${data.clientName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; font-family: monospace; color: #838e7f;">EMAIL</td>
                        <td style="font-size: 13px; font-weight: bold; color: #c8ff3d;">
                          <a href="mailto:${data.clientEmail}" style="color: #c8ff3d; text-decoration: none;">${data.clientEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; font-family: monospace; color: #838e7f;">COMPANY</td>
                        <td style="font-size: 13px; color: #ffffff;">${data.company || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; font-family: monospace; color: #838e7f;">PROJECT TYPE</td>
                        <td style="font-size: 13px; color: #ffffff;">${data.projectType}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; font-family: monospace; color: #838e7f;">BUDGET</td>
                        <td style="font-size: 13px; font-weight: bold; color: #ffffff;">${data.budget}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; font-family: monospace; color: #838e7f;">TIMELINE</td>
                        <td style="font-size: 13px; color: #a4ada0;">${data.timeline}</td>
                      </tr>
                      ${
                        data.meetingDate
                          ? `
                      <tr>
                        <td style="font-size: 11px; font-family: monospace; color: #838e7f;">SCHEDULED DATE</td>
                        <td style="font-size: 13px; font-weight: bold; color: #c8ff3d;">${data.meetingDate} at ${data.meetingTime || "Flexible"}</td>
                      </tr>`
                          : ""
                      }
                      ${
                        data.meetUrl
                          ? `
                      <tr>
                        <td style="font-size: 11px; font-family: monospace; color: #838e7f;">GOOGLE MEET</td>
                        <td style="font-size: 12px; font-family: monospace;">
                          <a href="${data.meetUrl}" target="_blank" style="color: #c8ff3d; text-decoration: underline;">${data.meetUrl}</a>
                        </td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Client Problem Statement / Brief -->
              <div style="background-color: #070a07; border: 1px solid #1c261b; padding: 16px 18px; border-radius: 4px;">
                <div style="font-size: 10px; font-family: monospace; color: #c8ff3d; font-weight: bold; margin-bottom: 6px; letter-spacing: 1px;">
                  CLIENT BRIEF / SYSTEM REQUIREMENTS:
                </div>
                <div style="font-size: 13px; line-height: 1.6; color: #e8eee2; white-space: pre-wrap;">${data.message}</div>
              </div>

              <!-- Quick Actions -->
              <div style="text-align: center; margin-top: 24px;">
                <a href="${siteUrl}/admin/inquiries" target="_blank" style="display: inline-block; background-color: #1a2517; border: 1px solid #c8ff3d; color: #c8ff3d; padding: 12px 24px; font-size: 12px; font-weight: 700; text-decoration: none; border-radius: 4px; font-family: monospace;">
                  ⚡ OPEN CONTROL ROOM &rarr;
                </a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export type ColdOutreachEmailData = {
  clientName: string;
  company?: string;
  projectName?: string;
  techStack?: string[];
  customSubject?: string;
  customBodyHtml: string;
  portfolioUrl?: string;
  calendlyUrl?: string;
};

/**
 * Builds a high-converting, professional cold outreach email with sleek cyberpunk styling and direct CTA.
 * Outer background is clean neutral, middle card is sleek dark luxury cyberpunk.
 */
export function buildColdOutreachHtml(data: ColdOutreachEmailData): string {
  const siteUrl = getProductionSiteUrl(data.portfolioUrl);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.customSubject || "AI & Workflow Automation Proposal"}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f4; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container (Middle Page) -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0c120c; border: 1px solid #233020; border-radius: 4px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.18);">
          
          <!-- Top Neon Accent -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #c8ff3d, #8aff00, #c8ff3d);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 26px 32px 18px 32px; background-color: #0e140e; border-bottom: 1px solid #1a2419;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; color: #c8ff3d; letter-spacing: 2px; text-transform: uppercase; font-family: monospace;">
                      MEHEDI · AI & AUTOMATION ARCHITECT
                    </div>
                    <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 4px; letter-spacing: -0.5px;">
                      ${data.customSubject || "Engineering Scalable Workflows & AI Systems"}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 32px; background-color: #0c120c;">
              
              <!-- Dynamic User Written Pitch Message -->
              <div style="font-size: 14.5px; line-height: 1.7; color: #d0dad0; margin-bottom: 24px;">
                ${data.customBodyHtml}
              </div>

              ${
                data.techStack && data.techStack.length > 0
                  ? `
              <!-- Tech Stack Highlight -->
              <div style="background-color: #080c08; border: 1px solid #1c261b; padding: 14px 18px; border-radius: 4px; margin-bottom: 24px;">
                <div style="font-size: 10px; font-family: monospace; color: #c8ff3d; font-weight: bold; margin-bottom: 8px; letter-spacing: 1px;">
                  FEATURED STACK & TOOLS:
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${data.techStack
                    .map(
                      tag =>
                        `<span style="display: inline-block; padding: 3px 8px; background-color: #141c14; border: 1px solid #293826; border-radius: 4px; font-size: 11px; font-family: monospace; color: #c8ff3d; margin: 2px;">${tag}</span>`
                    )
                    .join("")}
                </div>
              </div>`
                  : ""
              }

              <!-- Direct CTA Button -->
              <div style="text-align: center; margin: 30px 0 20px 0;">
                <a href="${siteUrl}/#contact" target="_blank" style="display: inline-block; background-color: #c8ff3d; color: #070907; padding: 13px 28px; font-size: 13px; font-weight: 800; text-decoration: none; border-radius: 4px; font-family: monospace; letter-spacing: 0.5px; box-shadow: 0 0 20px rgba(200, 255, 61, 0.4);">
                  ⚡ SCHEDULE A 15-MIN DISCOVERY CALL &rarr;
                </a>
              </div>

              <!-- Footer Signature -->
              <div style="border-top: 1px solid #1a2419; margin-top: 28px; padding-top: 20px;">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <div style="font-size: 14px; font-weight: bold; color: #ffffff;">Mehedi Hasan</div>
                      <div style="font-size: 12px; color: #838e7f;">AI Agents · n8n / Make Automations · SaaS Architecture</div>
                      <div style="font-size: 12px; color: #c8ff3d; margin-top: 4px; font-family: monospace;">
                        <a href="${siteUrl}" target="_blank" style="color: #c8ff3d; text-decoration: none;">${siteUrl.replace(/^https?:\/\//, "")}</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
