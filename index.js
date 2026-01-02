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
    message: `Commit for ${date}`
  };

  try {
    // Write data to file
    await jsonfile.writeFile(FILE_PATH, data);
    
    // Add file to git
    await git.add(FILE_PATH);
    
    // Commit with specific date
    await git.commit(`Update data - ${date}`, FILE_PATH, {
      '--date': date
    });
    
    console.log(`✅ Commit created for ${date}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating commit for ${date}:`, error.message);
    return false;
  }
};

// Function to generate commits for the past year (2024)
const generateCommits = async (numberOfCommits = 200) => {
  console.log(`🚀 Starting to generate ${numberOfCommits} commits for the past year...`);
  
  const commits = [];
  const today = moment();
  const oneYearAgo = moment().subtract(1, 'year');
  
  for (let i = 0; i < numberOfCommits; i++) {
    // Generate random date within the past year (2024)
    const randomDays = random.int(1, 365); // 1-365 days back
    const date = today.clone().subtract(randomDays, 'days').format();
    
    commits.push(date);
  }
  
  // Sort dates chronologically (oldest first)
  commits.sort();
  
  console.log(`📅 Creating commits from ${commits[0]} to ${commits[commits.length - 1]}`);
  
  // Create commits one by one
  for (let i = 0; i < commits.length; i++) {
    const date = commits[i];
    await makeCommit(date);
    
    // Show progress
    if ((i + 1) % 20 === 0) {
      console.log(`📊 Progress: ${i + 1}/${commits.length} commits created`);
    }
    
    // Small delay to avoid overwhelming git
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log('📤 Pushing commits to GitHub...');
  
  try {
    await git.push('origin', 'main');
    console.log('🎉 All commits pushed successfully to GitHub!');
    console.log('Check your GitHub profile to see the green squares!');
    console.log(`🌱 Created ${numberOfCommits} commits spanning the past year`);
  } catch (error) {
    console.error('❌ Error pushing to GitHub:', error.message);
    console.log('💡 Try running: git push origin main');
  }
};

// Function to create a specific pattern (optional)
const createPattern = async (pattern) => {
  console.log('🎨 Creating custom pattern...');
  
  const startDate = moment().subtract(1, 'year');
  
  for (let week = 0; week < pattern.length; week++) {
    for (let day = 0; day < pattern[week].length; day++) {
      if (pattern[week][day] === 1) {
        const commitDate = startDate.clone()
          .add(week, 'weeks')
          .add(day, 'days')
          .format();
        
        await makeCommit(commitDate);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }
  
  try {
    await git.push('origin', 'main');
    console.log('🎉 Pattern created and pushed to GitHub!');
  } catch (error) {
    console.error('❌ Error pushing pattern:', error.message);
  }
};

// Example pattern (creates a simple design)
const samplePattern = [
  [1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1]
];

// Main execution
const main = async () => {
  console.log('🌱 Welcome to goGreen!');
  console.log('This will create commits to make your GitHub profile green.');
  console.log(`📅 Today is: ${moment().format('YYYY-MM-DD')}`);
  console.log(`📅 Creating commits for the past year (${moment().subtract(1, 'year').format('YYYY-MM-DD')} to today)`);
  
  // Generate commits for the past year (2024)
  await generateCommits(250);
};

// Run the script
main().catch(console.error);
