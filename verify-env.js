/**
 * Simple script to verify .env.local file exists and contains correct values
 * Run with: node verify-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('=== Environment Variable Verification ===\n');

const envPath = path.join(__dirname, '.env.local');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('✗ .env.local file does not exist');
  console.log('  Expected location:', envPath);
  process.exit(1);
}

console.log('✓ .env.local file exists');

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let foundApiUrl = false;
let apiUrlValue = null;

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('NEXT_PUBLIC_API_URL=')) {
    foundApiUrl = true;
    apiUrlValue = trimmed.split('=')[1];
    break;
  }
}

if (foundApiUrl) {
  console.log('✓ NEXT_PUBLIC_API_URL is set in .env.local');
  console.log(`  Value: ${apiUrlValue}`);
  
  if (apiUrlValue === 'http://localhost:8000') {
    console.log('✓ API URL matches expected value (http://localhost:8000)');
  } else {
    console.log('⚠ API URL does not match expected value');
    console.log('  Expected: http://localhost:8000');
    console.log(`  Got: ${apiUrlValue}`);
  }
} else {
  console.log('✗ NEXT_PUBLIC_API_URL is not set in .env.local');
  console.log('  Please add: NEXT_PUBLIC_API_URL=http://localhost:8000');
}

console.log('\n=== Verification Complete ===');
