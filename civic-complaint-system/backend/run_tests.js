const { spawn } = require('child_process');
const path = require('path');

const server = spawn('node', ['server.js'], { cwd: __dirname, stdio: 'inherit' });

setTimeout(() => {
  const tests = spawn('node', ['test_api.js'], { cwd: __dirname, stdio: 'inherit' });
  tests.on('exit', (code) => {
    server.kill();
    process.exit(code);
  });
}, 2000);
