import fetch from 'node-fetch';

const registerAdmin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin2@sairosproperties.com',
        password: 'Admin@123',
        phone: '+263771234567',
        role: 'admin'
      })
    });

    const data = await response.json();
    console.log('Registration successful:', data);
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};

registerAdmin(); 