const fs = require("fs");
const path = require("path");

async function test() {
  console.log("Testing resume APIs...");
  const dummyPdf = Buffer.from("%PDF-1.4 sample pdf content for mehedi portfolio testing");
  
  // Test local upload if server is running
  try {
    const res = await fetch("http://localhost:3000/api/resume/download");
    console.log("Current download endpoint status:", res.status);
  } catch (err) {
    console.log("Server test notice:", err.message);
  }
}

test();
