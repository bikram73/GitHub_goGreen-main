import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import { execSync } from 'child_process';
import readline from 'readline';

const FILE_PATH = "./data.json";
const git = simpleGit();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌱 Universal goGreen - Make ANY GitHub Profile Green!');
console.log('===================================================');
console.log('');
console.log('🎯 This tool works for ANY GitHub user!');
console.log('📧 Just enter your GitHub email and username');
console.log('🌍 Works worldwide for all developers');
console.log('');

// Function to get user configuration
const getUserConfig = () => {
  return new Promise((resolve) => {
    console.log('📋 Setup your GitHub account information:');
    console.log('');
    
    rl.question('📧 Enter your GitHub email address: ', (email) => {
      if (!email || !email.includes('@')) {
        console.log('❌ Invalid email format. Please enter a valid email.');
        rl.close();
        return;
      }
      
      rl.question('👤 Enter your GitHub username: ', (username) => {
        if (!username) {
          console.log('❌ Username cannot be empty.');
          rl.close();
          return;
        }
        
        rl.question('📅 Enter year to create commits for (2024, 2025, etc.): ', (year) => {
          if (!year || !year.match(/^\d{4}$/)) {
            console.log('❌ Invalid year. Please enter 4-digit year (e.g., 2024)');
            rl.close();
            return;
          }
          
          rl.question('🎲 Choose pattern (1=Dense, 2=Realistic, 3=Custom): ', (pattern) => {
            const patternType = parseInt(pattern);
            if (![1, 2, 3].includes(patternType)) {
              console.log('❌ Invalid pattern. Choose 1, 2, or 3.');
              rl.close();
              return;
            }
            
            resolve({
              email: email.trim(),
              username: username.trim(),
              year: year.trim(),
              pattern: patternType
            });
          });
        });
      });
    });
  });
};

// Function to configure git with user's credentials
const configureGit = async (email, username) => {
  console.log('⚙️  Configuring git with your credentials...');
  
  try {
    execSync(`git config --global user.email "${email}"`, { stdio: 'inherit' });
    execSync(`git config --global user.name "${username}"`, { stdio: 'inherit' });
    
    console.log('✅ Git configured successfully!');
    console.log(`   📧 Email: ${email}`);
    console.log(`   👤 Name: ${username}`);
    console.log('');
    
    return true;
  } catch (error) {
    console.error('❌ Error configuring git:', error.message);
    return false;
  }
};

// Function to create a commit with specific date and user's credentials
const makeCommit = async (dateString, message, email, username) => {
  const data = {
    date: dateString,
    message: message,
    author: email,
    timestamp: new Date().toISOString()
  };

  try {
    await jsonfile.writeFile(FILE_PATH, data);
    await git.add(FILE_PATH);
    
    const gitCommand = `git commit -m "${message}" --date="${dateString}" --author="${username} <${email}>"`;
    execSync(gitCommand, { stdio: 'pipe' });
    
    return true;
  } catch (error) {
    console.error(`❌ Error creating commit: ${error.message}`);
    return false;
  }
};

// Pattern 1: Dense activity (lots of commits)
const createDensePattern = (year) => {
  const commits = [];
  
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      if (Math.random() < 0.8) { // 80% chance of activity
        const commitsPerDay = Math.floor(Math.random() * 8) + 1; // 1-8 commits
        
        for (let i = 0; i < commitsPerDay; i++) {
          const hour = Math.floor(Math.random() * 12) + 9; // 9 AM to 8 PM
          const minute = Math.floor(Math.random() * 60);
          const second = Math.floor(Math.random() * 60);
          
          const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
          const fullDate = `${dateStr} ${timeStr}`;
          
          commits.push({
            date: fullDate,
            message: `Green activity - ${dateStr} #${i + 1}`
          });
        }
      }
    }
  }
  
  return commits;
};

// Pattern 2: Realistic activity (bursts and gaps)
const createRealisticPattern = (year) => {
  const commits = [];
  let currentDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  
  while (currentDate <= endDate) {
    // Activity burst (1-4 days)
    const burstLength = Math.floor(Math.random() * 4) + 1;
    
    for (let i = 0; i < burstLength && currentDate <= endDate; i++) {
      const commitsPerDay = Math.floor(Math.random() * 6) + 1; // 1-6 commits
      
      for (let j = 0; j < commitsPerDay; j++) {
        const hour = Math.floor(Math.random() * 12) + 9;
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        const fullDate = `${dateStr} ${timeStr}`;
        
        commits.push({
          date: fullDate,
          message: `Work session - ${dateStr} #${j + 1}`
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Gap (2-15 days)
    const gapDays = Math.floor(Math.random() * 14) + 2;
    currentDate.setDate(currentDate.getDate() + gapDays);
  }
  
  return commits;
};

// Pattern 3: Custom pattern
const createCustomPattern = (year) => {
  return new Promise((resolve) => {
    console.log('🎨 Custom Pattern Options:');
    console.log('1. Light activity (100-200 commits)');
    console.log('2. Medium activity (300-500 commits)');
    console.log('3. Heavy activity (600-1000 commits)');
    console.log('');
    
    rl.question('Choose activity level (1-3): ', (level) => {
      const activityLevel = parseInt(level);
      let targetCommits;
      
      switch (activityLevel) {
        case 1: targetCommits = Math.floor(Math.random() * 101) + 100; break; // 100-200
        case 2: targetCommits = Math.floor(Math.random() * 201) + 300; break; // 300-500
        case 3: targetCommits = Math.floor(Math.random() * 401) + 600; break; // 600-1000
        default: targetCommits = 250;
      }
      
      console.log(`🎯 Creating ${targetCommits} commits...`);
      
      const commits = [];
      for (let i = 0; i < targetCommits; i++) {
        const randomDay = Math.floor(Math.random() * 365);
        const date = new Date(`${year}-01-01`);
        date.setDate(date.getDate() + randomDay);
        
        const hour = Math.floor(Math.random() * 12) + 9;
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);
        
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        const fullDate = `${dateStr} ${timeStr}`;
        
        commits.push({
          date: fullDate,
          message: `Custom activity - ${dateStr}`
        });
      }
      
      commits.sort((a, b) => new Date(a.date) - new Date(b.date));
      resolve(commits);
    });
  });
};

// Main function to create commits
const createCommits = async (config) => {
  console.log('🎨 Generating commit pattern...');
  
  let commits;
  
  switch (config.pattern) {
    case 1:
      commits = createDensePattern(config.year);
      break;
    case 2:
      commits = createRealisticPattern(config.year);
      break;
    case 3:
      commits = await createCustomPattern(config.year);
      break;
  }
  
  console.log(`🎯 Generated ${commits.length} commits for ${config.year}`);
  console.log(`📅 Date range: ${commits[0].date} to ${commits[commits.length - 1].date}`);
  console.log('');
  
  let successCount = 0;
  
  console.log('🚀 Creating commits...');
  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];
    const success = await makeCommit(commit.date, commit.message, config.email, config.username);
    
    if (success) {
      successCount++;
      
      if (successCount % 50 === 0) {
        console.log(`✅ Created ${successCount}/${commits.length} commits`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  console.log(`🎉 Successfully created ${successCount} commits!`);
  console.log('📤 Pushing to GitHub...');
  
  try {
    await git.push('origin', 'main');
    console.log('🚀 All commits pushed to GitHub!');
    console.log('');
    console.log('🌱 SUCCESS! Your GitHub profile should now be GREEN! 🌱');
    console.log(`🔗 Check your profile: https://github.com/${config.username}/`);
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ Created ${successCount} commits for ${config.year}`);
    console.log(`   ✅ All commits authored by: ${config.email}`);
    console.log(`   ✅ Profile: https://github.com/${config.username}/`);
    console.log('');
    console.log('💡 GitHub may take 5-10 minutes to update your contribution graph.');
    
  } catch (error) {
    console.error('❌ Push failed:', error.message);
    console.log('💡 Make sure you have push access to this repository.');
  }
};

// Main execution
const main = async () => {
  try {
    const config = await getUserConfig();
    console.log('');
    
    const gitConfigured = await configureGit(config.email, config.username);
    if (!gitConfigured) {
      console.log('❌ Failed to configure git. Exiting.');
      rl.close();
      return;
    }
    
    await createCommits(config);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  rl.close();
};

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\n❌ Operation cancelled.');
  rl.close();
});

main();