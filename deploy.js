const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

// Helper function to run commands
function runCommand(command, cwd = process.cwd()) {
  console.log(`${colors.fg.cyan}> ${command}${colors.reset}`);
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      cwd 
    });
  } catch (error) {
    console.error(`${colors.fg.red}Command failed: ${command}${colors.reset}`);
    throw error;
  }
}

// Print header
console.log(`
${colors.fg.green}${colors.bright}======================================
 RentX Deployment Script
======================================${colors.reset}
`);

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log(`${colors.fg.green}✓ Vercel CLI is installed${colors.reset}`);
} catch (error) {
  console.log(`${colors.fg.yellow}! Vercel CLI is not installed. Installing...${colors.reset}`);
  runCommand('npm install -g vercel');
}

// Deploy backend
console.log(`\n${colors.fg.magenta}${colors.bright}Deploying Backend...${colors.reset}`);
try {
  runCommand('vercel --prod', path.join(process.cwd(), 'rentx-backend'));
  console.log(`${colors.fg.green}✓ Backend deployed successfully${colors.reset}`);
} catch (error) {
  console.error(`${colors.fg.red}Failed to deploy backend: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Deploy frontend
console.log(`\n${colors.fg.magenta}${colors.bright}Deploying Frontend...${colors.reset}`);
try {
  runCommand('vercel --prod', path.join(process.cwd(), 'rentx-frontend'));
  console.log(`${colors.fg.green}✓ Frontend deployed successfully${colors.reset}`);
} catch (error) {
  console.error(`${colors.fg.red}Failed to deploy frontend: ${error.message}${colors.reset}`);
  process.exit(1);
}

console.log(`
${colors.fg.green}${colors.bright}======================================
 Deployment Complete!
======================================${colors.reset}

${colors.fg.yellow}Note: Make sure to set the following environment variables in your Vercel projects:${colors.reset}

${colors.fg.cyan}Frontend:${colors.reset}
- NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api

${colors.fg.cyan}Backend:${colors.reset}
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret_key
`); 