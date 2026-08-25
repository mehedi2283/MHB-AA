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

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket("client-screenshots", {
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  });
  console.log("Create bucket result:", data, error);
}

createBucket();
