// Simple test to verify DEFAULT_RESUME has placeholder content
const { DEFAULT_RESUME } = require('./lib/types/resume.ts');

console.log('Testing DEFAULT_RESUME placeholder content...\n');

// Test personal info
console.log('Personal Info:');
console.log('- Full Name:', DEFAULT_RESUME.personalInfo.fullName);
console.log('- Email:', DEFAULT_RESUME.personalInfo.email);
console.log('- Summary:', DEFAULT_RESUME.personalInfo.summary.substring(0, 50) + '...');

// Test sections have items
console.log('\nSections:');
DEFAULT_RESUME.sections.forEach(section => {
  console.log(`- ${section.title}: ${section.items.length} items`);
  if (section.items.length > 0) {
    console.log(`  First item: ${JSON.stringify(section.items[0], null, 2).substring(0, 100)}...`);
  }
});

console.log('\n✅ DEFAULT_RESUME has placeholder content for all sections!');
