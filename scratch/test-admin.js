const http = require('http');

const routes = [
  '/admin',
  '/admin/clients',
  '/admin/leads',
  '/admin/conversations',
  '/admin/inquiries',
  '/admin/ai',
  '/admin/settings',
  '/admin/content/site',
  '/admin/content/projects',
  '/admin/content/services',
  '/admin/content/technologies',
  '/admin/content/process',
  '/admin/content/globe'
];

async function checkRoutes() {
  for (const route of routes) {
    try {
      const res = await fetch('http://localhost:3000' + route);
      console.log(`[STATUS ${res.status}] ${route}`);
    } catch (err) {
      console.error(`[ERROR] ${route}: ${err.message}`);
    }
  }
}

checkRoutes();
