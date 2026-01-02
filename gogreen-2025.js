import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import { execSync } from 'child_process';

const FILE_PATH = "./data.json";
const git = simpleGit();

console.log('🌱 goGreen 2025 - Creating commits with random patterns');
console.log('===================================================');
console.log('📧 Email: bikram8548@gmail.com');
console.log('👤 Name: Bikram Manna');
console.log('📅 Year: 2025');
console.log('🎲 Random commits per day: 1-12 commits');
console.log('');

// Function to create a commit with specific date and correct author
const makeCommitWithCorrectAuthor = async (dateString, message, commitNumber) => {
  const data = {
    date: dateString,
    message: message,
    commitNumber: commitNumber,
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
    execSync(gitCommand, { stdio: 'pipe' }); // Use pipe to reduce output
    
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
};

// Create commits for 2025 with random patterns
const create2025Commits = async () => {
  console.log('🎯 Creating commits for 2025 with random patterns...');
  
  const commits = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  const currentDay = today.getDate();
  
  // Generate commits for 2025
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2025, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      // Skip future dates if we're in 2025
      if (currentYear === 2025 && month > currentMonth) break;
      if (currentYear === 2025 && month === currentMonth && day > currentDay) break;
      
      // 85% chance of activity on any given day
      if (Math.random() < 0.85) {
        // Random number of commits per day (1-12, with higher probability for lower numbers)
        const randomCommits = Math.floor(Math.random() * 100);
        let commitsPerDay;
        
        if (randomCommits < 30) commitsPerDay = Math.floor(Math.random() * 3) + 1; // 1-3 commits (30%)
        else if (randomCommits < 50) commitsPerDay = Math.floor(Math.random() * 3) + 4; // 4-6 commits (20%)
        else if (randomCommits < 70) commitsPerDay = Math.floor(Math.random() * 3) + 7; // 7-9 commits (20%)
        else if (randomCommits < 85) commitsPerDay = Math.floor(Math.random() * 3) + 10; // 10-12 commits (15%)
        else if (randomCommits < 95) commitsPerDay = Math.floor(Math.random() * 5) + 13; // 13-17 commits (10%)
        else commitsPerDay = Math.floor(Math.random() * 8) + 18; // 18-25 commits (5%)
        
        for (let i = 0; i < commitsPerDay; i++) {
          const dateStr = `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const hour = Math.floor(Math.random() * 14) + 8; // 8 AM to 9 PM
          const minute = Math.floor(Math.random() * 60);
          const second = Math.floor(Math.random() * 60);
          
          const fullDate = `${dateStr} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
          commits.push({
            date: fullDate,
            day: dateStr,
            commitNumber: i + 1,
            totalForDay: commitsPerDay
          });
        }
      }
    }
  }
  
  // Sort commits chronologically
  commits.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  console.log(`🎯 Will create ${commits.length} commits for 2025`);
  console.log(`📅 First commit: ${commits[0].date}`);
  console.log(`📅 Last commit: ${commits[commits.length - 1].date}`);
  console.log('');
  
  // Show some statistics
  const dayStats = {};
  commits.forEach(commit => {
    if (!dayStats[commit.day]) dayStats[commit.day] = 0;
    dayStats[commit.day]++;
  });
  
  const commitCounts = Object.values(dayStats);
  const maxCommitsPerDay = Math.max(...commitCounts);
  const avgCommitsPerDay = (commitCounts.reduce((a, b) => a + b, 0) / commitCounts.length).toFixed(1);
  
  console.log('📊 Statistics:');
  console.log(`   📈 Max commits in a day: ${maxCommitsPerDay}`);
  console.log(`   📊 Average commits per active day: ${avgCommitsPerDay}`);
  console.log(`   📅 Active days: ${commitCounts.length}`);
  console.log('');
  
  let successCount = 0;
  
  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];
    const message = commit.commitNumber === 1 && commit.totalForDay > 1 
      ? `Green activity - ${commit.day} (${commit.totalForDay} commits today)`
      : `Green activity - ${commit.day} #${commit.commitNumber}`;
    
    const success = await makeCommitWithCorrectAuthor(commit.date, message, commit.commitNumber);
    if (success) {
      successCount++;
      
      if (successCount % 50 === 0) {
        console.log(`✅ Created ${successCount}/${commits.length} commits`);
      }
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 15));
  }
  
  console.log(`🎉 Successfully created ${successCount} commits for 2025!`);
  console.log('📤 Pushing to GitHub...');
  
  try {
    await git.push('origin', 'main');
    console.log('🚀 All commits pushed to GitHub!');
    console.log('');
    console.log('🌱 SUCCESS! Your 2025 GitHub activity is now AMAZING! 🌱');
    console.log('🔗 Check your profile: https://github.com/bikram73/');
    console.log('');
    console.log('📊 Final Summary:');
    console.log(`   ✅ Created ${successCount} commits for 2025`);
    console.log(`   ✅ Random patterns: 1-25 commits per day`);
    console.log(`   ✅ All commits authored by: bikram8548@gmail.com`);
    console.log(`   ✅ Repository: bikram73/GitHub_goGreen-main`);
    console.log('');
    console.log('🎨 Your contribution graph now shows:');
    console.log('   🟢 Varied activity patterns (some days light, some heavy)');
    console.log('   🟢 Realistic commit distribution');
    console.log('   🟢 Professional-looking activity throughout 2025');
    console.log('');
    console.log('💡 GitHub may take 5-10 minutes to update your contribution graph.');
  } catch (error) {
    console.error('❌ Push failed:', error.message);
  }
};

create2025Commits().catch(console.error);