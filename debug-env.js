// Debug environment variables
const fs = require('fs');

console.log('=== Environment Variable Debug ===\n');

// Read .env.local
try {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const lines = envContent.split('\n');
  
  console.log('.env.local contents (first 50 chars of each value):');
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        console.log(`  ${key.trim()}: ${value.trim().substring(0, 50)}... (length: ${value.trim().length})`);
      }
    }
  });
  
  // Check specific YOU_API_KEY
  const match = envContent.match(/YOU_API_KEY=(.+)/);
  if (match) {
    const apiKey = match[1].trim();
    console.log('\n=== YOU_API_KEY Analysis ===');
    console.log('Length:', apiKey.length);
    console.log('Has quotes?', apiKey.startsWith('"') || apiKey.startsWith("'"));
    console.log('Has spaces?', apiKey.includes(' '));
    console.log('Has newlines?', apiKey.includes('\n') || apiKey.includes('\r'));
    console.log('First 10 chars:', apiKey.substring(0, 10));
    console.log('Last 10 chars:', apiKey.substring(apiKey.length - 10));
    
    // Clean version
    const cleaned = apiKey.replace(/['"]/g, '').trim();
    console.log('\nCleaned length:', cleaned.length);
    console.log('Cleaned first 10:', cleaned.substring(0, 10));
  } else {
    console.log('\n❌ YOU_API_KEY not found in .env.local');
  }
} catch (error) {
  console.error('Error reading .env.local:', error.message);
}
