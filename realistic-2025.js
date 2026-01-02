import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import { execSync } from 'child_process';

const FILE_PATH = "./data.json";
const git = simpleGit();

console.log('🌱 Realistic goGreen 2025 - Natural Activity Patterns');
console.log('====================================================');
console.log('📧 Email: bikram8548@gmail.com');
console.log('👤 Name: Bikram Manna');
console.log('📅 Year: 2025');
console.log('🎯 Target: 220-255 total commits');
console.log('🎲 Pattern: Random gaps, bursts, and breaks');
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
    await jsonfile.writeFile(FILE_PATH, data);
    await git.add(FILE_PATH);
    
    const gitCommand = `git commit -m "${message}" --date="${dateString}" --author="Bikram Manna <bikram8548@gmail.com>"`;
    execSync(gitCommand, { stdio: 'pipe' });
    
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
};

// Generate realistic activity patterns
const generateRealisticPattern = () => {
  const commits = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  
  let currentDate = new Date('2025-01-01');
  const endDate = currentYear === 2025 ? today : new Date('2025-12-31');
  
  console.log('🎨 Generating realistic activity patterns...');
  
  while (currentDate <= endDate) {
    // Decide on activity burst length (1-4 consecutive days)
    const burstLength = Math.random() < 0.3 ? 1 : // 30% single day
                      Math.random() < 0.6 ? 2 : // 30% two days  
                      Math.random() < 0.8 ? 3 : 4; // 20% three days, 20% four days
    
    // Create commits for the burst period
    for (let i = 0; i < burstLength && currentDate <= endDate; i++) {
      // Random commits per day (1-9, with preference for lower numbers)
      const rand = Math.random();
      let commitsPerDay;
      
      if (rand < 0.4) commitsPerDay = Math.floor(Math.random() * 2) + 1; // 1-2 commits (40%)
      else if (rand < 0.7) commitsPerDay = Math.floor(Math.random() * 2) + 3; // 3-4 commits (30%)
      else if (rand < 0.85) commitsPerDay = Math.floor(Math.random() * 2) + 5; // 5-6 commits (15%)
      else if (rand < 0.95) commitsPerDay = Math.floor(Math.random() * 2) + 7; // 7-8 commits (10%)
      else commitsPerDay = 9; // 9 commits (5%)
      
      // Create commits for this day
      for (let j = 0; j < commitsPerDay; j++) {
        const hour = Math.floor(Math.random() * 13) + 9; // 9 AM to 9 PM
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        const fullDate = `${dateStr} ${timeStr}`;
        
        const message = j === 0 && commitsPerDay > 1 
          ? `Activity burst - ${dateStr} (${commitsPerDay} commits)`
          : `Daily work - ${dateStr} #${j + 1}`;
        
        commits.push({
          date: fullDate,
          message: message,
          day: dateStr
        });
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Random gap after burst (2-20 days, with different probabilities)
    const gapRand = Math.random();
    let gapDays;
    
    if (gapRand < 0.3) gapDays = Math.floor(Math.random() * 2) + 2; // 2-3 days (30%)
    else if (gapRand < 0.5) gapDays = Math.floor(Math.random() * 3) + 4; // 4-6 days (20%)
    else if (gapRand < 0.7) gapDays = Math.floor(Math.random() * 4) + 7; // 7-10 days (20%)
    else if (gapRand < 0.85) gapDays = Math.floor(Math.random() * 5) + 11; // 11-15 days (15%)
    else if (gapRand < 0.95) gapDays = Math.floor(Math.random() * 5) + 16; // 16-20 days (10%)
    else gapDays = Math.floor(Math.random() * 10) + 21; // 21-30 days (5%)
    
    // Skip gap days
    currentDate.setDate(currentDate.getDate() + gapDays);
  }
  
  return commits;
};

// Create commits for 2025 with realistic patterns
const createRealistic2025 = async () => {
  let commits = generateRealisticPattern();
  
  // Limit to target range (220-255 commits)
  const targetCommits = Math.floor(Math.random() * 36) + 220; // 220-255
  if (commits.length > targetCommits) {
    commits = commits.slice(0, targetCommits);
  }
  
  console.log(`🎯 Generated ${commits.length} commits (target: ${targetCommits})`);
  console.log(`📅 First commit: ${commits[0].date}`);
  console.log(`📅 Last commit: ${commits[commits.length - 1].date}`);
  console.log('');
  
  // Show activity pattern statistics
  const dayStats = {};
  commits.forEach(commit => {
    if (!dayStats[commit.day]) dayStats[commit.day] = 0;
    dayStats[commit.day]++;
  });
  
  const activeDays = Object.keys(dayStats).length;
  const commitCounts = Object.values(dayStats);
  const maxCommitsPerDay = Math.max(...commitCounts);
  const avgCommitsPerDay = (commitCounts.reduce((a, b) => a + b, 0) / commitCounts.length).toFixed(1);
  
  console.log('📊 Activity Pattern:');
  console.log(`   📅 Active days: ${activeDays}`);
  console.log(`   📈 Max commits in a day: ${maxCommitsPerDay}`);
  console.log(`   📊 Average commits per active day: ${avgCommitsPerDay}`);
  console.log(`   🎯 Total commits: ${commits.length}`);
  console.log('');
  
  let successCount = 0;
  
  console.log('🚀 Creating commits...');
  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];
    const success = await makeCommitWithCorrectAuthor(commit.date, commit.message);
    
    if (success) {
      successCount++;
      
      if (successCount % 25 === 0) {
        console.log(`✅ Created ${successCount}/${commits.length} commits`);
      }
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  
  console.log(`🎉 Successfully created ${successCount} commits for 2025!`);
  console.log('📤 Pushing to GitHub...');
  
  try {
    await git.push('origin', 'main');
    console.log('🚀 All commits pushed to GitHub!');
    console.log('');
    console.log('🌱 SUCCESS! Your 2025 GitHub activity looks REALISTIC! 🌱');
    console.log('🔗 Check your profile: https://github.com/bikram73/');
    console.log('');
    console.log('📊 Final Summary:');
    console.log(`   ✅ Created ${successCount} commits for 2025`);
    console.log(`   ✅ Realistic patterns: bursts and gaps`);
    console.log(`   ✅ Natural activity distribution`);
    console.log(`   ✅ All commits authored by: bikram8548@gmail.com`);
    console.log('');
    console.log('🎨 Your contribution graph shows:');
    console.log('   🟢 Activity bursts (2-4 consecutive days)');
    console.log('   ⚪ Natural gaps (2-20+ days between activity)');
    console.log('   🟢 Varied commit counts (1-9 per active day)');
    console.log('   🟢 Human-like coding patterns');
    console.log('');
    console.log('💡 This looks like real developer activity!');
  } catch (error) {
    console.error('❌ Push failed:', error.message);
  }
};

createRealistic2025().catch(console.error);