import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🏥 Launching Prescripto Plus (Backend + Frontend)...');
console.log('====================================================\n');

// 1. Start Backend Express Server (Port 5001)
const serverProcess = spawn('node', ['server/server.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Vite Dev Server (Port 5173)
const frontendProcess = spawn('npx', ['vite', '--port', '5173'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

function handleExit() {
  console.log('\n🛑 Shutting down Prescripto Plus system...');
  serverProcess.kill();
  frontendProcess.kill();
  process.exit();
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
