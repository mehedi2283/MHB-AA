const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const env = fs.readFileSync(".env.local", "utf8");
const envVars = {};
env.split("\n").forEach(line => {
  const [k, ...v] = line.split("=");
  if (k && v.length) envVars[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(
  envVars.SUPABASE_URL,
  envVars.SUPABASE_SECRET_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsert() {
  const payload = {
    name: "Mehedi Test Client",
    email: "automationengineer422@gmail.com",
    company: "Acme Automation",
    projectType: "Workflow automation",
    budget: "$3,000–$5,000",
    timeline: "Within 1 month",
    message: "I need a complete n8n workflow automation system and GHL integration.",
    meetingRequested: true,
    meetingDate: "2026-08-26",
    meetingTime: "03:00 PM",
    timezone: "Asia/Dhaka",
    meetUrl: "https://meet.google.com/test-room",
    submissionStatus: "new",
    visible: true,
  };

  const inqRes = await supabase.from("cms_documents").insert({
    collection: "inquiries",
    data: payload,
    sort_order: 1,
    status: "published",
    visible: true,
  }).select("*");
  console.log("Inquiry insert result:", inqRes.error ? inqRes.error.message : inqRes.data);

  const leadRes = await supabase.from("cms_documents").insert({
    collection: "leads",
    data: payload,
    sort_order: 1,
    status: "published",
    visible: true,
  }).select("*");
  console.log("Lead insert result:", leadRes.error ? leadRes.error.message : leadRes.data);
}

testInsert();
