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

async function test() {
  const { data, error } = await supabase.from("cms_documents").select("*");
  console.log("Error:", error);
  console.log("Total docs:", data?.length);
  console.log("Collections:", data?.map(d => ({ id: d.id, collection: d.collection, data: d.data })));

  const tables = await supabase.from("inquiries").select("*");
  console.log("Inquiries table:", tables.error ? tables.error.message : tables.data?.length);

  const leads = await supabase.from("leads").select("*");
  console.log("Leads table:", leads.error ? leads.error.message : leads.data?.length);
}

test();
