import fetch from 'node-fetch';

const testFrontendLogin = async () => {
  try {
    // First test server connection
    console.log('1. Testing server connection...');
    try {
      const healthCheck = await fetch('http://localhost:5000/api/auth/login', {
        method: 'GET'
      });
      console.log('Server response status:', healthCheck.status);
      console.log('Server reachable:', healthCheck.ok);
    } catch (error) {
      console.error('Server connection error:', error.message);
    }

    // Then test login with verbose logging
    console.log('\n2. Testing login...');
    const loginData = {
      email: 'admin5@sairosproperties.com',
      password: 'Admin@123'
    };

    console.log('Request payload:', loginData);
    console.log('Request URL: http://localhost:5000/api/auth/login');

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    
    if (response.ok) {
      console.log('Login successful!');
      console.log('Response data:', data);
    } else {
      console.error('Login failed!');
      console.error('Error response:', data);
    }

  } catch (error) {
    console.error('Test failed with error:', error.message);
    console.error('Full error:', error);
  }
};

console.log('Starting frontend login test...\n');
testFrontendLogin(); 