import { execSync } from 'child_process';
import moment from 'moment';

console.log('🌱 goGreen - Contribution Summary');
console.log('================================');

// Get total commits
const totalCommits = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
console.log(`📊 Total commits in repository: ${totalCommits}`);

// Get commits by year
const commits2024 = execSync('git log --pretty=format:"%ad" --date=short | findstr "2024" | find /c "2024"', { encoding: 'utf8' }).trim();
const commits2025 = execSync('git log --pretty=format:"%ad" --date=short | findstr "2025" | find /c "2025"', { encoding: 'utf8' }).trim();

console.log(`📅 Commits in 2024: ${commits2024}`);
console.log(`📅 Commits in 2025: ${commits2025}`);

console.log('\n🎯 GitHub Contribution Graph:');
console.log('Your profile should now show:');
console.log('✅ Green squares throughout 2024');
console.log('✅ Recent activity in the last 30 days');
console.log('✅ Consistent contribution pattern');

console.log('\n🔗 Check your profile at:');
console.log('https://github.com/bikram73/GitHub_goGreen-main');

console.log('\n💡 Note: GitHub may take a few minutes to update the contribution graph.');
console.log('If you don\'t see changes immediately, wait 5-10 minutes and refresh.');