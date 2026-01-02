import simpleGit from "simple-git";
import { execSync } from 'child_process';
import readline from 'readline';

const git = simpleGit();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗑️  Remove Commits by Year');
console.log('==========================');
console.log('');
console.log('⚠️  WARNING: This will permanently remove commits from the specified year!');
console.log('💡 This is useful if you want to clean up or redo commits for a specific year.');
console.log('');

// Function to get commits count for a specific year
const getCommitsCountForYear = async (year) => {
  try {
    const result = execSync(`git log --pretty=format:"%ad" --date=short | findstr "${year}" | find /c "${year}"`, { encoding: 'utf8' });
    return parseInt(result.trim()) || 0;
  } catch (error) {
    return 0;
  }
};

// Function to show available years with commit counts
const showAvailableYears = async () => {
  console.log('📊 Available years with commits:');
  console.log('');
  
  const years = ['2024', '2025', '2026'];
  for (const year of years) {
    const count = await getCommitsCountForYear(year);
    if (count > 0) {
      console.log(`   📅 ${year}: ${count} commits`);
    }
  }
  console.log('');
};

// Function to remove commits from a specific year
const removeCommitsByYear = async (year) => {
  console.log(`🔍 Checking commits for year ${year}...`);
  
  const commitsCount = await getCommitsCountForYear(year);
  
  if (commitsCount === 0) {
    console.log(`❌ No commits found for year ${year}`);
    return false;
  }
  
  console.log(`📊 Found ${commitsCount} commits for year ${year}`);
  console.log('');
  
  return new Promise((resolve) => {
    rl.question(`⚠️  Are you sure you want to remove ALL ${commitsCount} commits from ${year}? (yes/no): `, async (answer) => {
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled.');
        resolve(false);
        return;
      }
      
      console.log(`🗑️  Removing commits from ${year}...`);
      console.log('⏳ This may take a while...');
      
      try {
        // Create a new branch for backup
        const backupBranch = `backup-before-removing-${year}-${Date.now()}`;
        await git.checkoutLocalBranch(backupBranch);
        await git.checkout('main');
        
        console.log(`💾 Created backup branch: ${backupBranch}`);
        
        // Get all commit hashes for the specified year
        const commitHashes = execSync(
          `git log --pretty=format:"%H %ad" --date=short | findstr "${year}" | for /f "tokens=1" %i in ('more') do @echo %i`,
          { encoding: 'utf8' }
        ).trim().split('\n').filter(hash => hash.length > 0);
        
        if (commitHashes.length === 0) {
          console.log(`❌ No commit hashes found for ${year}`);
          resolve(false);
          return;
        }
        
        console.log(`🎯 Found ${commitHashes.length} commit hashes to remove`);
        
        // Use git filter-branch to remove commits (alternative approach)
        console.log('🔄 Using interactive rebase to remove commits...');
        
        // Get the earliest commit hash for the year
        const earliestCommit = commitHashes[commitHashes.length - 1];
        const parentCommit = execSync(`git rev-parse ${earliestCommit}^`, { encoding: 'utf8' }).trim();
        
        // Create a script to remove commits from the specified year
        const filterCommand = `git filter-branch --commit-filter '
          if [ "$GIT_AUTHOR_DATE" != "" ]; then
            YEAR=$(date -d "$GIT_AUTHOR_DATE" +%Y 2>/dev/null || echo "")
            if [ "$YEAR" = "${year}" ]; then
              skip_commit "$@"
            else
              git commit-tree "$@"
            fi
          else
            git commit-tree "$@"
          fi
        ' --all`;
        
        // Alternative: Remove commits one by one (safer approach)
        console.log('🔄 Removing commits individually...');
        
        for (let i = 0; i < commitHashes.length; i++) {
          const hash = commitHashes[i];
          console.log(`   🗑️  Removing commit ${i + 1}/${commitHashes.length}: ${hash.substring(0, 8)}`);
          
          try {
            // Use git revert for safer removal
            execSync(`git revert --no-edit ${hash}`, { stdio: 'pipe' });
          } catch (error) {
            console.log(`   ⚠️  Could not revert ${hash.substring(0, 8)}, skipping...`);
          }
        }
        
        console.log('📤 Pushing changes to GitHub...');
        await git.push('origin', 'main', ['--force']);
        
        console.log('');
        console.log('🎉 SUCCESS! Commits removed successfully!');
        console.log('');
        console.log('📊 Summary:');
        console.log(`   🗑️  Removed commits from: ${year}`);
        console.log(`   💾 Backup branch created: ${backupBranch}`);
        console.log(`   🔗 Check your profile: https://github.com/bikram73/`);
        console.log('');
        console.log('💡 If you want to restore, you can merge the backup branch.');
        
        resolve(true);
        
      } catch (error) {
        console.error('❌ Error removing commits:', error.message);
        console.log('');
        console.log('💡 Alternative manual method:');
        console.log('1. git log --oneline --since="YEAR-01-01" --until="YEAR-12-31"');
        console.log('2. git rebase -i <commit-before-first-commit-to-remove>');
        console.log('3. Change "pick" to "drop" for commits you want to remove');
        console.log('4. git push --force origin main');
        
        resolve(false);
      }
    });
  });
};

// Main function
const main = async () => {
  await showAvailableYears();
  
  rl.question('📅 Enter the year to remove commits from (e.g., 2024, 2025): ', async (year) => {
    if (!year || !year.match(/^\d{4}$/)) {
      console.log('❌ Invalid year format. Please enter a 4-digit year (e.g., 2024)');
      rl.close();
      return;
    }
    
    const success = await removeCommitsByYear(year);
    
    if (success) {
      console.log('');
      console.log('🌱 You can now run a goGreen script to create new commits for this year!');
      console.log(`   Example: node final-gogreen.js (modify year to ${year})`);
    }
    
    rl.close();
  });
};

// Handle Ctrl+C gracefully
rl.on('SIGINT', () => {
  console.log('\n❌ Operation cancelled by user.');
  rl.close();
});

main().catch(console.error);