// Simple test to verify template rendering
const { DEFAULT_RESUME } = require('./lib/types/resume.ts');

console.log('DEFAULT_RESUME sections:');
DEFAULT_RESUME.sections.forEach(section => {
  console.log(`- ${section.title}: ${section.items.length} items`);
  if (section.items.length > 0) {
    section.items.forEach((item, index) => {
      console.log(`  Item ${index + 1}:`, item);
    });
  }
});

console.log('Personal Info:');
console.log('- Name:', DEFAULT_RESUME.personalInfo.fullName);
console.log('- Job Title:', DEFAULT_RESUME.personalInfo.jobTitle);
console.log('- Summary:', DEFAULT_RESUME.personalInfo.summary);
