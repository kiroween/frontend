// Simple test runner for Property 10
const { execSync } = require('child_process');

try {
  console.log('Running Property 10 test...');
  execSync('npx vitest run src/lib/api/__tests__/client.test.ts', {
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log('Test completed successfully!');
} catch (error) {
  console.error('Test failed:', error.message);
  process.exit(1);
}
