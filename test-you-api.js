const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testYouAPI() {
  const apiKey = process.env.YOU_API_KEY;
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');

  const response = await fetch('https://api.you.com/v1/agents/runs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent: 'advanced',
      input: 'Say hello',
      stream: false,
    }),
  });

  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
}

testYouAPI();
