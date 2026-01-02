import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import { execSync } from 'child_process';

const FILE_PATH = "./data.json";
const git = simpleGit();

// Function to create a commit with a specific date using git directly
const makeCommitWithDate = async (dateString, message) => {
  const data = {
    date: dateString,
    message: message,
    timestamp: new Date().toISOString()
  };

  try {
    // Write data to file
    await jsonfile.writeFile(FILE_PATH, data);
    
    // Add file
    await git.add(FILE_PATH);
    
    // Create commit with specific date using git command directly
    const gitCommand = `git commit -m "${message}" --date="${dateString}"`;
    execSync(gitCommand, { stdio: 'inherit' });
    
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
};

// Create commits for 2024 specifically
const create2024Commits = async () => {
  console.log('🌱 Creating commits specifically for 2024');
  console.log('==========================================');
  
  const commits = [];
  
  // Generate dates for 2024
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      // Skip some days randomly (70% chance of activity)
      if (Math.random() < 0.7) {
        const dateStr = `2024-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const hour = Math.floor(Math.random() * 12) + 9; // 9 AM to 8 PM
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);
        
        const fullDate = `${dateStr} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        commits.push(fullDate);
      }
    }
  }
  
  console.log(`🎯 Will create ${commits.length} commits for 2024`);
  console.log(`📅 First commit: ${commits[0]}`);
  console.log(`📅 Last commit: ${commits[commits.length - 1]}`);
  
  let successCount = 0;
  
  for (let i = 0; i < commits.length; i++) {
    const dateStr = commits[i];
    const message = `Activity on ${dateStr.split(' ')[0]}`;
    
    const success = await makeCommitWithDate(dateStr, message);
    if (success) {
      successCount++;
      
      if (successCount % 50 === 0) {
        console.log(`✅ Created ${successCount}/${commits.length} commits`);
      }
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  
  console.log(`🎉 Successfully created ${successCount} commits for 2024!`);
  
  try {
    await git.push('origin', 'main');
    console.log('🚀 All commits pushed to GitHub!');
    console.log('🌱 Your profile should now show green squares for 2024!');
    console.log('🔗 Check: https://github.com/bikram73/');
  } catch (error) {
    console.error('❌ Push failed:', error.message);
  }
};

create2024Commits().catch(console.error);