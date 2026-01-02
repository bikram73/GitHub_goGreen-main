import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🌱 goGreen - Automatic Setup for Main Profile');
console.log('==============================================');
console.log('');

const setupSteps = [
  '1. 🆕 Create a new repository on GitHub',
  '2. 📁 Clone the repository locally', 
  '3. 📋 Copy goGreen files',
  '4. 🚀 Install dependencies and run'
];

console.log('📋 What this script will help you do:');
setupSteps.forEach(step => console.log(`   ${step}`));
console.log('');

console.log('🔗 STEP 1: Create a new repository');
console.log('   Go to: https://github.com/new');
console.log('   Repository name: "gogreen" (or any name)');
console.log('   Make it Public or Private');
console.log('   Click "Create repository"');
console.log('');

console.log('💻 STEP 2: Run these commands in a new terminal:');
console.log('');
console.log('   # Clone your new repository');
console.log('   git clone https://github.com/bikram73/gogreen.git');
console.log('   cd gogreen');
console.log('');
console.log('   # Copy the goGreen files (from this directory):');
console.log('   # Copy all files from gogreen-main-setup/ folder to your new repository');
console.log('');
console.log('   # Install and run');
console.log('   npm install');
console.log('   npm run green');
console.log('');

console.log('📁 Files ready in gogreen-main-setup/ folder:');
const setupDir = './gogreen-main-setup';
if (fs.existsSync(setupDir)) {
  const files = fs.readdirSync(setupDir);
  files.forEach(file => {
    console.log(`   ✅ ${file}`);
  });
} else {
  console.log('   ❌ Setup directory not found');
}

console.log('');
console.log('🎯 After running npm run green in your new repository:');
console.log('   ✅ Your profile will show green squares');
console.log('   ✅ 200-300 commits will be created for the past year');
console.log('   ✅ All commits will be pushed to GitHub');
console.log('   ✅ Your main profile will look active and green!');
console.log('');
console.log('🔗 Check result at: https://github.com/bikram73/');