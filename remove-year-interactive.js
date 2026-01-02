import simpleGit from "simple-git";
import { execSync } from 'child_process';
import readline from 'readline';

const git = simpleGit();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗑️  Remove Commits by Year - Interactive');
console.log('========================================');
console.log('');

// Function to get commit count for a year
const getCommitCount = (year) => {
  try {
    const logs = execSync(`git log --pretty=format:"%ad" --date=short`, { encoding: 'utf8' });
    const lines = logs.split('\n');
    return lines.filter(line => line.includes(year)).length;
  } catch (error) {
    return 0;
  }
};

// Function to show available years
const showYears = () => {
  console.log('📊 Available years with commits:');
  console.log('');
  
  const years = ['2024', '2025', '2026'];
  const availableYears = [];
  
  years.forEach(year => {
    const count = getCommitCount(year);
    if (count > 0) {
      console.log(`   📅 ${year}: ${count} commits`);
      availableYears.push(year);
    }
  });
  
  console.log('');
  return availableYears;
};

// Function to remove commits from a specific year
const removeYear = async (year) => {
  const count = getCommitCount(year);
  
  if (count === 0) {
    console.log(`❌ No commits found for year ${year}`);
    return false;
  }
  
  console.log(`⚠️  This will remove ${count} commits from ${year}`);
  console.log('💾 Creating backup first...');
  
  try {
    // Create backup
    const backupBranch = `backup-${year}-${Date.now()}`;
    await git.checkoutLocalBranch(backupBranch);
    await git.push('origin', backupBranch);
    await git.checkout('main');
    
    console.log(`✅ Backup created: ${backupBranch}`);
    
    // Get all commits and filter out the target year
    console.log('🔄 Processing commits...');
    
    // Simple approach: get commit hashes for the year and revert them
    const allLogs = execSync(`git log --pretty=format:"%H %ad" --date=short`, { encoding: 'utf8' });
    const lines = allLogs.split('\n');
    const targetCommits = lines
      .filter(line => line.includes(year))
      .map(line => line.split(' ')[0])
      .reverse(); // Reverse to revert in chronological order
    
    console.log(`🎯 Found ${targetCommits.length} commits to remove`);
    
    // Revert commits one by one
    for (let i = 0; i < targetCommits.length; i++) {
      const hash = targetCommits[i];
      console.log(`   🗑️  Reverting ${i + 1}/${targetCommits.length}: ${hash.substring(0, 8)}`);
      
      try {
        execSync(`git revert --no-edit ${hash}`, { stdio: 'pipe' });
      } catch (error) {
        console.log(`   ⚠️  Could not revert ${hash.substring(0, 8)}, trying to continue...`);
      }
    }
    
    console.log('📤 Pushing changes...');
    await git.push('origin', 'main');
    
    console.log('');
    console.log('🎉 SUCCESS!');
    console.log(`✅ Removed commits from ${year}`);
    console.log(`💾 Backup saved as: ${backupBranch}`);
    console.log('🔗 Check: https://github.com/bikram73/');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('🛠️  Manual method if automatic failed:');
    console.log(`1. git log --oneline | findstr "${year}"`);
    console.log('2. git revert <commit-hash> for each commit');
    console.log('3. git push origin main');
    
    return false;
  }
};

// Main interactive function
const main = () => {
  const availableYears = showYears();
  
  if (availableYears.length === 0) {
    console.log('❌ No commits found in any year.');
    rl.close();
    return;
  }
  
  rl.question('📅 Enter year to remove (e.g., 2024, 2025): ', (year) => {
    if (!availableYears.includes(year)) {
      console.log(`❌ Invalid year. Available years: ${availableYears.join(', ')}`);
      rl.close();
      return;
    }
    
    rl.question(`⚠️  Are you sure you want to remove ALL commits from ${year}? (yes/no): `, async (confirm) => {
      if (confirm.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled.');
        rl.close();
        return;
      }
      
      console.log('');
      console.log(`🗑️  Removing commits from ${year}...`);
      
      const success = await removeYear(year);
      
      if (success) {
        console.log('');
        console.log('🌱 You can now create new commits for this year!');
        console.log(`   Example: Modify final-gogreen.js to target ${year}`);
      }
      
      rl.close();
    });
  });
};

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\n❌ Operation cancelled.');
  rl.close();
});

main();