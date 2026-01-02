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
    message: `Commit for ${date}`,
    timestamp: new Date().toISOString()
  };

  try {
    // Write data to file
    await jsonfile.writeFile(FILE_PATH, data);
    
    // Add file to git
    await git.add(FILE_PATH);
    
    // Commit with specific date
    await git.commit(`Update data - ${moment(date).format('MMM DD, YYYY')}`, FILE_PATH, {
      '--date': date
    });
    
    return true;
  } catch (error) {
    console.error(`❌ Error creating commit for ${date}:`, error.message);
    return false;
  }
};

// Create commits specifically for 2024 (past year)
const createPastYearCommits = async () => {
  console.log('🌱 Creating commits for the past year (2024)...');
  
  const today = moment();
  const startDate = moment('2024-01-01');
  const endDate = moment('2024-12-31');
  
  console.log(`📅 Date range: ${startDate.format('YYYY-MM-DD')} to ${endDate.format('YYYY-MM-DD')}`);
  
  const commits = [];
  
  // Generate 300 random dates in 2024
  for (let i = 0; i < 300; i++) {
    const randomDay = random.int(0, 365); // Random day in 2024
    const commitDate = startDate.clone().add(randomDay, 'days');
    
    // Only add if it's not in the future
    if (commitDate.isBefore(today)) {
      commits.push(commitDate.format());
    }
  }
  
  // Remove duplicates and sort
  const uniqueCommits = [...new Set(commits)].sort();
  
  console.log(`🎯 Will create ${uniqueCommits.length} commits`);
  console.log(`📊 First commit: ${uniqueCommits[0]}`);
  console.log(`📊 Last commit: ${uniqueCommits[uniqueCommits.length - 1]}`);
  
  // Create commits
  let successCount = 0;
  for (let i = 0; i < uniqueCommits.length; i++) {
    const date = uniqueCommits[i];
    const success = await makeCommit(date);
    
    if (success) {
      successCount++;
      if (successCount % 25 === 0) {
        console.log(`✅ Created ${successCount}/${uniqueCommits.length} commits`);
      }
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  
  console.log(`🎉 Successfully created ${successCount} commits!`);
  console.log('📤 Pushing to GitHub...');
  
  try {
    await git.push('origin', 'main');
    console.log('🚀 All commits pushed to GitHub!');
    console.log('🌱 Your GitHub profile should now show green squares for 2024!');
    console.log('🔗 Check: https://github.com/bikram73/GitHub_goGreen-main');
  } catch (error) {
    console.error('❌ Push failed:', error.message);
    console.log('💡 Try: git push origin main');
  }
};

// Run the script
console.log('🌱 goGreen - Making your GitHub profile green!');
console.log(`📅 Current date: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
createPastYearCommits().catch(console.error);