import fetch from 'node-fetch';

const registerAdmin = async () => {
  try {
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin5@sairosproperties.com',
      password: 'Admin@123',
      phone: '+263771234567',
      role: 'admin'
    };

    console.log('Attempting to register admin with data:', adminData);

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Registration successful:', data);
      
      // Try to login immediately after registration
      console.log('\nAttempting to login with new credentials...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminData.email,
          password: adminData.password
        })
      });

      const loginData = await loginResponse.json();
      if (loginResponse.ok) {
        console.log('Login successful:', loginData);
      } else {
        console.error('Login failed:', loginData);
      }
    } else {
      console.error('Registration failed:', data);
    }
  } catch (error) {
    console.error('Operation failed:', error.message);
    console.error('Full error:', error);
  }
};

registerAdmin(); 