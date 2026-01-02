import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const FILE_PATH = "./data.json";
const git = simpleGit();

// Function to make a single commit with a specific date
const makeCommit = async (date) => {
  const data = {
    date: date,
    message: `Activity on ${moment(date).format('MMM DD, YYYY')}`,
    timestamp: new Date().toISOString()
  };

  try {
    await jsonfile.writeFile(FILE_PATH, data);
    await git.add(FILE_PATH);
    await git.commit(`Green activity - ${moment(date).format('MMM DD, YYYY')}`, FILE_PATH, {
      '--date': date
    });
    return true;
  } catch (error) {
    console.error(`❌ Error creating commit for ${date}:`, error.message);
    return false;
  }
};

// Create commits for the ACTUAL past year (2024-2025)
const fixProfileGreen = async () => {
  console.log('🌱 Fixing GitHub Profile - Creating commits for 2024-2025');
  console.log('========================================================');
  
  const today = moment(); // 2026-01-02
  const commits = [];
  
  // Create commits for 2024 (full year)
  console.log('📅 Creating commits for 2024...');
  const start2024 = moment('2024-01-01');
  const end2024 = moment('2024-12-31');
  
  for (let date = start2024.clone(); date.isSameOrBefore(end2024); date.add(1, 'day')) {
    // 70% chance of activity on any given day
    if (random.int(1, 100) <= 70) {
      const commitsPerDay = random.int(1, 4); // 1-4 commits per day
      
      for (let i = 0; i < commitsPerDay; i++) {
        const commitTime = date.clone()
          .add(random.int(8, 20), 'hours')
          .add(random.int(0, 59), 'minutes')
          .add(random.int(0, 59), 'seconds');
        
        commits.push(commitTime.format());
      }
    }
  }
  
  // Create commits for 2025 (up to today)
  console.log('📅 Creating commits for 2025...');
  const start2025 = moment('2025-01-01');
  const end2025 = moment('2025-12-31');
  
  for (let date = start2025.clone(); date.isSameOrBefore(end2025) && date.isBefore(today); date.add(1, 'day')) {
    // 80% chance of activity on any given day in 2025
    if (random.int(1, 100) <= 80) {
      const commitsPerDay = random.int(1, 3); // 1-3 commits per day
      
      for (let i = 0; i < commitsPerDay; i++) {
        const commitTime = date.clone()
          .add(random.int(9, 19), 'hours')
          .add(random.int(0, 59), 'minutes')
          .add(random.int(0, 59), 'seconds');
        
        commits.push(commitTime.format());
      }
    }
  }
  
  // Sort commits chronologically
  commits.sort();
  
  console.log(`🎯 Will create ${commits.length} commits`);
  console.log(`📅 Date range: ${moment(commits[0]).format('MMM DD, YYYY')} to ${moment(commits[commits.length - 1]).format('MMM DD, YYYY')}`);
  
  let successCount = 0;
  
  for (let i = 0; i < commits.length; i++) {
    const date = commits[i];
    const success = await makeCommit(date);
    
    if (success) {
      successCount++;
      
      // Show progress every 100 commits
      if (successCount % 100 === 0) {
        console.log(`✅ Progress: ${successCount}/${commits.length} commits created`);
      }
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  console.log(`🎉 Successfully created ${successCount} commits!`);
  console.log('📤 Pushing all commits to GitHub...');
  
  try {
    await git.push('origin', 'main');
    console.log('🚀 All commits pushed successfully!');
    console.log('');
    console.log('🌱 Your GitHub profile should now be GREEN! 🌱');
    console.log('🔗 Check your profile: https://github.com/bikram73/');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ Created ${successCount} commits`);
    console.log(`   ✅ Covers 2024-2025 (the actual past year)`);
    console.log(`   ✅ Realistic activity patterns`);
    console.log('');
    console.log('💡 GitHub may take 5-10 minutes to update the contribution graph.');
  } catch (error) {
    console.error('❌ Error pushing to GitHub:', error.message);
    console.log('💡 Try running: git push origin main');
  }
};

// Run the fix
console.log(`📅 Current date: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
console.log('🔧 This will create commits for 2024-2025 to make your profile green!');
console.log('');

fixProfileGreen().catch(console.error);