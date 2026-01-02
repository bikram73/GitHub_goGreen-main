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

// Create commits for the past year to make profile green
const makeProfileGreen = async () => {
  console.log('🌱 goGreen - Making your GitHub profile green!');
  console.log('===============================================');
  console.log(`📅 Current date: ${moment().format('YYYY-MM-DD')}`);
  
  const commits = [];
  const today = moment();
  
  // Create commits for the past 365 days
  console.log('📊 Generating commit dates for the past year...');
  
  for (let i = 1; i <= 365; i++) {
    // Skip some days randomly to make it look more natural
    if (random.int(1, 100) <= 75) { // 75% chance of commit on any day
      const date = today.clone().subtract(i, 'days');
      
      // Add 1-3 commits per day
      const commitsPerDay = random.int(1, 3);
      for (let j = 0; j < commitsPerDay; j++) {
        const commitTime = date.clone()
          .add(random.int(9, 18), 'hours')
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
      
      // Show progress every 50 commits
      if (successCount % 50 === 0) {
        console.log(`✅ Progress: ${successCount}/${commits.length} commits created`);
      }
    }
    
    // Small delay to avoid overwhelming git
    await new Promise(resolve => setTimeout(resolve, 20));
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
    console.log('💡 Note: GitHub may take a few minutes to update the contribution graph.');
    console.log('   If you don\'t see changes immediately, wait 5-10 minutes and refresh.');
  } catch (error) {
    console.error('❌ Error pushing to GitHub:', error.message);
    console.log('💡 Try running: git push origin main');
  }
};

// Initialize data file if it doesn't exist
const initializeDataFile = async () => {
  try {
    await jsonfile.readFile(FILE_PATH);
  } catch (error) {
    // File doesn't exist, create it
    await jsonfile.writeFile(FILE_PATH, { initialized: moment().format() });
  }
};

// Main execution
const main = async () => {
  try {
    await initializeDataFile();
    await makeProfileGreen();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Run the script
main();