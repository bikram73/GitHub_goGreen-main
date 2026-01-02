import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import { execSync } from 'child_process';

const FILE_PATH = "./data.json";
const git = simpleGit();

console.log('🌱 Final goGreen - Creating commits with correct author');
console.log('====================================================');
console.log('📧 Email: bikram8548@gmail.com');
console.log('👤 Name: Bikram Manna');
console.log('🔗 Profile: https://github.com/bikram73/');
console.log('');

// Function to create a commit with specific date and correct author
const makeCommitWithCorrectAuthor = async (dateString, message) => {
  const data = {
    date: dateString,
    message: message,
    author: 'bikram8548@gmail.com',
    timestamp: new Date().toISOString()
  };

  try {
    // Write data to file
    await jsonfile.writeFile(FILE_PATH, data);
    
    // Add file
    await git.add(FILE_PATH);
    
    // Create commit with specific date and author
    const gitCommand = `git commit -m "${message}" --date="${dateString}" --author="Bikram Manna <bikram8548@gmail.com>"`;
    execSync(gitCommand, { stdio: 'inherit' });
    
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
};

// Create commits for 2024 with correct author
const createFinalCommits = async () => {
  console.log('🎯 Creating commits for 2024 with correct author...');
  
  const commits = [];
  
  // Generate dates for 2024 (every few days to look natural)
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day += Math.floor(Math.random() * 3) + 1) {
      // Skip some days randomly (80% chance of activity)
      if (Math.random() < 0.8) {
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
  console.log('');
  
  let successCount = 0;
  
  for (let i = 0; i < commits.length; i++) {
    const dateStr = commits[i];
    const message = `Green activity - ${dateStr.split(' ')[0]}`;
    
    const success = await makeCommitWithCorrectAuthor(dateStr, message);
    if (success) {
      successCount++;
      
      if (successCount % 25 === 0) {
        console.log(`✅ Created ${successCount}/${commits.length} commits`);
      }
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  
  console.log(`🎉 Successfully created ${successCount} commits for 2024!`);
  console.log('📤 Pushing to GitHub...');
  
  try {
    await git.push('origin', 'main');
    console.log('🚀 All commits pushed to GitHub!');
    console.log('');
    console.log('🌱 SUCCESS! Your GitHub profile should now be GREEN! 🌱');
    console.log('🔗 Check your profile: https://github.com/bikram73/');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ Created ${successCount} commits for 2024`);
    console.log(`   ✅ All commits authored by: bikram8548@gmail.com`);
    console.log(`   ✅ Repository: bikram73/GitHub_goGreen-main`);
    console.log('');
    console.log('💡 GitHub may take 5-10 minutes to update your contribution graph.');
    console.log('   If you don\'t see changes immediately, wait and refresh your profile.');
  } catch (error) {
    console.error('❌ Push failed:', error.message);
  }
};

createFinalCommits().catch(console.error);