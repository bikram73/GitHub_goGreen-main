import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Git Configuration Setup for GitHub Profile');
console.log('==============================================');
console.log('');

console.log('📧 STEP 1: Find your GitHub email');
console.log('1. Go to: https://github.com/settings/emails');
console.log('2. Look for your primary email address');
console.log('3. Copy that email address');
console.log('');

console.log('💡 Common GitHub emails look like:');
console.log('   - yourname@gmail.com');
console.log('   - yourname@outlook.com');
console.log('   - yourname@yahoo.com');
console.log('   - Or your work/personal email');
console.log('');

rl.question('📧 Enter your GitHub email address: ', (email) => {
  if (!email || !email.includes('@')) {
    console.log('❌ Invalid email. Please enter a valid email address.');
    rl.close();
    return;
  }

  console.log('');
  console.log('⚙️  Configuring git...');
  
  try {
    // Configure git with the provided email and username
    execSync(`git config --global user.email "${email}"`, { stdio: 'inherit' });
    execSync(`git config --global user.name "bikram73"`, { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ Git configuration successful!');
    console.log('');
    console.log('📋 Configuration set:');
    console.log(`   Email: ${email}`);
    console.log(`   Name: bikram73`);
    console.log('');
    
    // Verify the configuration
    const configuredEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
    const configuredName = execSync('git config user.name', { encoding: 'utf8' }).trim();
    
    console.log('🔍 Verification:');
    console.log(`   Configured email: ${configuredEmail}`);
    console.log(`   Configured name: ${configuredName}`);
    console.log('');
    
    console.log('🎉 SUCCESS! Git is now configured with your GitHub account.');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('1. Run: node create-2024-commits.js');
    console.log('2. Wait 5-10 minutes');
    console.log('3. Check your profile: https://github.com/bikram73/');
    console.log('');
    console.log('🌱 Your GitHub profile will now show green squares!');
    
  } catch (error) {
    console.error('❌ Error configuring git:', error.message);
  }
  
  rl.close();
});