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
    message: `Recent activity - ${date}`,
    timestamp: new Date().toISOString()
  };

  try {
    await jsonfile.writeFile(FILE_PATH, data);
    await git.add(FILE_PATH);
    await git.commit(`Recent activity - ${moment(date).format('MMM DD, YYYY')}`, FILE_PATH, {
      '--date': date
    });
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
};

// Create commits for the last 30 days
const createRecentCommits = async () => {
  console.log('🕒 Creating recent commits (last 30 days)...');
  
  const commits = [];
  const today = moment();
  
  // Create commits for the last 30 days
  for (let i = 1; i <= 30; i++) {
    const date = today.clone().subtract(i, 'days');
    
    // Add 1-3 commits per day randomly
    const commitsPerDay = random.int(1, 3);
    for (let j = 0; j < commitsPerDay; j++) {
      const commitTime = date.clone()
        .add(random.int(9, 18), 'hours') // Random hour between 9 AM and 6 PM
        .add(random.int(0, 59), 'minutes');
      
      commits.push(commitTime.format());
    }
  }
  
  commits.sort();
  console.log(`🎯 Creating ${commits.length} recent commits`);
  
  let successCount = 0;
  for (const date of commits) {
    const success = await makeCommit(date);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  
  console.log(`✅ Created ${successCount} recent commits`);
  
  try {
    await git.push('origin', 'main');
    console.log('🚀 Recent commits pushed to GitHub!');
  } catch (error) {
    console.error('❌ Push failed:', error.message);
  }
};

createRecentCommits().catch(console.error);