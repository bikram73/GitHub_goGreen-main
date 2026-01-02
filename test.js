import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const FILE_PATH = "./data.json";
const git = simpleGit();

// Simple test function to create just a few commits
const createTestCommits = async () => {
  console.log('🧪 Creating test commits...');
  
  // Create 5 test commits for the past week
  for (let i = 1; i <= 5; i++) {
    const date = moment().subtract(i, 'days').format();
    
    const data = {
      date: date,
      message: `Test commit ${i}`,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Write to file
      await jsonfile.writeFile(FILE_PATH, data);
      
      // Add and commit
      await git.add(FILE_PATH);
      await git.commit(`Test commit ${i} - ${date}`, FILE_PATH, {
        '--date': date
      });
      
      console.log(`✅ Created commit ${i} for ${date}`);
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error with commit ${i}:`, error.message);
    }
  }
  
  console.log('📤 Pushing test commits...');
  
  try {
    await git.push('origin', 'main');
    console.log('🎉 Test commits pushed! Check your GitHub profile.');
  } catch (error) {
    console.error('❌ Push failed:', error.message);
    console.log('💡 You might need to authenticate with GitHub first.');
  }
};

// Run the test
createTestCommits().catch(console.error);