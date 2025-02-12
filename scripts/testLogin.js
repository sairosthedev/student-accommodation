import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    const loginData = {
      email: 'admin5@sairosproperties.com',
      password: 'Admin@123'
    };

    console.log('Attempting to login with:', loginData);

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Login successful:', data);
      console.log('Token:', data.token);
    } else {
      console.error('Login failed:', data);
      console.error('Status:', response.status);
      console.error('Response headers:', response.headers);
    }
  } catch (error) {
    console.error('Login failed with error:', error.message);
    console.error('Full error:', error);
  }
};

testLogin(); 