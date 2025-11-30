const { execSync } = require('child_process');

console.log('Running UI Property-Based Tests...\n');

try {
  console.log('Testing TombstoneCard component...');
  execSync('npx vitest run src/components/graveyard/__tests__/TombstoneCard.test.tsx', {
    stdio: 'inherit',
    cwd: __dirname
  });

  console.log('\nTesting ContentViewer component...');
  execSync('npx vitest run src/components/resurrection/__tests__/ContentViewer.test.tsx', {
    stdio: 'inherit',
    cwd: __dirname
  });

  console.log('\nUI Property Tests Complete!');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}
