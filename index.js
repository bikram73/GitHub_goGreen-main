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

// Function to generate commits for the past year
const generateCommits = async (numberOfCommits = 100) => {
  console.log(`🚀 Starting to generate ${numberOfCommits} commits...`);
  
  const commits = [];
  
  for (let i = 0; i < numberOfCommits; i++) {
    // Generate random date within the past year
    const weeksBack = random.int(0, 52); // 0-52 weeks back
    const dayOfWeek = random.int(0, 6);   // 0-6 days of week
    
    const date = moment()
      .subtract(weeksBack, 'weeks')
      .subtract(dayOfWeek, 'days')
      .format();
    
    commits.push(date);
  }
  
  // Sort dates chronologically
  commits.sort();
  
  // Create commits one by one
  for (const date of commits) {
    await makeCommit(date);
    // Small delay to avoid overwhelming git
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('📤 Pushing commits to GitHub...');
  
  try {
    await git.push('origin', 'main');
    console.log('🎉 All commits pushed successfully to GitHub!');
    console.log('Check your GitHub profile to see the green squares!');
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
  
  // Choose what to run:
  // Option 1: Generate random commits
  await generateCommits(150);
  
  // Option 2: Create a pattern (uncomment to use)
  // await createPattern(samplePattern);
};

// Run the script
main().catch(console.error);
