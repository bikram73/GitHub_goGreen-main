import simpleGit from "simple-git";
import { execSync } from 'child_process';

const git = simpleGit();

// Configuration - CHANGE THIS TO THE YEAR YOU WANT TO REMOVE
const YEAR_TO_REMOVE = '2025'; // Change this to 2024, 2025, etc.

console.log('🗑️  Simple Remove Commits by Year');
console.log('==================================');
console.log(`🎯 Target Year: ${YEAR_TO_REMOVE}`);
console.log('');

// Function to get commits count for the specified year
const getCommitsCount = () => {
  try {
    const result = execSync(`git log --pretty=format:"%ad" --date=short | Select-String "${YEAR_TO_REMOVE}" | Measure-Object`, { encoding: 'utf8' });
    const match = result.match(/Count\s*:\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  } catch (error) {
    console.log('Trying alternative method...');
    try {
      const logs = execSync(`git log --pretty=format:"%ad" --date=short`, { encoding: 'utf8' });
      const lines = logs.split('\n');
      return lines.filter(line => line.includes(YEAR_TO_REMOVE)).length;
    } catch (e) {
      return 0;
    }
  }
};

// Function to remove commits using git reset (DANGEROUS but effective)
const removeCommitsByReset = async () => {
  console.log(`🔍 Checking commits for year ${YEAR_TO_REMOVE}...`);
  
  const commitsCount = getCommitsCount();
  
  if (commitsCount === 0) {
    console.log(`❌ No commits found for year ${YEAR_TO_REMOVE}`);
    return;
  }
  
  console.log(`📊 Found ${commitsCount} commits for year ${YEAR_TO_REMOVE}`);
  console.log('');
  console.log('⚠️  WARNING: This will remove ALL commits from the specified year!');
  console.log('💾 Creating backup first...');
  
  try {
    // Create backup branch
    const backupBranch = `backup-${YEAR_TO_REMOVE}-${Date.now()}`;
    await git.checkoutLocalBranch(backupBranch);
    await git.push('origin', backupBranch);
    await git.checkout('main');
    
    console.log(`✅ Backup created: ${backupBranch}`);
    console.log('');
    
    // Get the commit hash just before the first commit of the target year
    console.log(`🔍 Finding commits before ${YEAR_TO_REMOVE}...`);
    
    // Find the last commit before the target year
    let resetPoint = null;
    try {
      const beforeYear = (parseInt(YEAR_TO_REMOVE) - 1).toString();
      const result = execSync(`git log --pretty=format:"%H %ad" --date=short | Select-String "${beforeYear}" | Select-Object -First 1`, { encoding: 'utf8' });
      const match = result.match(/([a-f0-9]{40})/);
      if (match) {
        resetPoint = match[1];
      }
    } catch (error) {
      console.log('Could not find automatic reset point.');
    }
    
    if (!resetPoint) {
      console.log('❌ Could not automatically determine reset point.');
      console.log('');
      console.log('🛠️  Manual method:');
      console.log('1. Run: git log --oneline --date=short');
      console.log(`2. Find the last commit BEFORE ${YEAR_TO_REMOVE}`);
      console.log('3. Run: git reset --hard <commit-hash>');
      console.log('4. Run: git push --force origin main');
      console.log('');
      console.log(`💾 Your backup is saved in branch: ${backupBranch}`);
      return;
    }
    
    console.log(`🎯 Reset point found: ${resetPoint.substring(0, 8)}`);
    console.log('');
    console.log('🗑️  Removing commits...');
    
    // Reset to the point before target year
    await git.reset(['--hard', resetPoint]);
    
    console.log('📤 Pushing changes to GitHub...');
    await git.push('origin', 'main', ['--force']);
    
    console.log('');
    console.log('🎉 SUCCESS! Commits removed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   🗑️  Removed all commits from: ${YEAR_TO_REMOVE}`);
    console.log(`   💾 Backup branch: ${backupBranch}`);
    console.log(`   🔗 Check your profile: https://github.com/bikram73/`);
    console.log('');
    console.log('🌱 You can now run a goGreen script to create new commits!');
    
    // Verify removal
    const remainingCommits = getCommitsCount();
    console.log(`✅ Verification: ${remainingCommits} commits remaining for ${YEAR_TO_REMOVE}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('🛠️  If automatic removal failed, try manual method:');
    console.log('1. git log --oneline');
    console.log(`2. Find commits from ${YEAR_TO_REMOVE}`);
    console.log('3. git reset --hard <hash-before-target-year>');
    console.log('4. git push --force origin main');
  }
};

// Simple version that just shows information
const showCommitInfo = () => {
  console.log('📊 Commit Information:');
  console.log('');
  
  const years = ['2024', '2025', '2026'];
  years.forEach(year => {
    try {
      const logs = execSync(`git log --pretty=format:"%ad" --date=short`, { encoding: 'utf8' });
      const count = logs.split('\n').filter(line => line.includes(year)).length;
      if (count > 0) {
        console.log(`   📅 ${year}: ${count} commits`);
      }
    } catch (error) {
      console.log(`   📅 ${year}: Unable to count`);
    }
  });
  
  console.log('');
  console.log(`🎯 To remove commits from ${YEAR_TO_REMOVE}:`);
  console.log('   1. Make sure YEAR_TO_REMOVE is set correctly at the top of this file');
  console.log('   2. Uncomment the removeCommitsByReset() call at the bottom');
  console.log('   3. Run the script again');
  console.log('');
  console.log('⚠️  WARNING: This will permanently remove commits!');
};

// Main execution
console.log('ℹ️  Currently in SAFE MODE - showing information only');
console.log('');

showCommitInfo();

// UNCOMMENT THE LINE BELOW TO ACTUALLY REMOVE COMMITS (DANGEROUS!)
// removeCommitsByReset();

console.log('');
console.log('💡 To actually remove commits:');
console.log('   1. Edit this file and uncomment the removeCommitsByReset() line');
console.log('   2. Change YEAR_TO_REMOVE at the top to your target year');
console.log('   3. Run the script again');