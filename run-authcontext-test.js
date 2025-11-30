const { spawn } = require('child_process');
const path = require('path');

const vitestPath = path.join(__dirname, 'node_modules', '.bin', 'vitest');

const child = spawn(vitestPath, ['run', 'src/contexts/__tests__/AuthContext.test.tsx'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});
