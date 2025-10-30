// Test You.com API
const fs = require('fs');

// Read .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf-8');
const apiKeyMatch = envContent.match(/YOU_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

console.log('Testing You.com API...');
console.log('API Key configured:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');

if (!apiKey) {
  console.error('❌ YOU_API_KEY not found in .env.local');
  process.exit(1);
}

async function testSearch() {
  const queries = ['React hooks', 'latest react', 'javascript', 'web development'];
  
  for (const query of queries) {
    const url = `https://api.ydc-index.io/v1/search?query=${encodeURIComponent(query)}&count=5`;
    
    console.log(`\n🔍 Testing Search API with: "${query}"`);
    console.log('URL:', url);
  
    try {
      const response = await fetch(url, {
        headers: {
          'X-API-Key': apiKey,
        },
      });
      
      console.log('Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        continue;
      }
      
      const data = await response.json();
      console.log('✅ Success!');
      console.log('Results found:', data.results?.web?.length || 0);
      
      if (data.results?.web?.[0]) {
        console.log('First result:');
        console.log('  Title:', data.results.web[0].title);
        console.log('  URL:', data.results.web[0].url);
      } else {
        console.log('  Metadata:', data.metadata);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
}

async function testAgent() {
  console.log('\n🤖 Testing Express Agent API...');
  console.log('Using API Key:', apiKey.substring(0, 20) + '...');
  
  try {
    const requestBody = {
      agent: 'express',
      input: 'What is React?',
      stream: false,
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://api.ydc-index.io/v1/agents/runs', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Success!');
    console.log('Response:', data.output?.[0]?.text?.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSearch().then(() => testAgent());
