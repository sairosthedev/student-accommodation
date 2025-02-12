import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaGithub, FaRegEnvelope, FaLock, FaUser, FaPhone, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BACKEND_URL } from '../../urls';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    program: ''
  });
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const roomImages = [
    {
      url: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?ixlib=rb-4.0.3",
      title: "Luxury Student Rooms",
      description: "Start your academic journey in our premium accommodation spaces"
    },
    {
      url: "https://images.unsplash.com/photo-1592247350271-c5efb34dd967?ixlib=rb-4.0.3",
      title: "Modern Amenities",
      description: "Enjoy state-of-the-art facilities designed for student life"
    },
    {
      url: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?ixlib=rb-4.0.3",
      title: "Community Living",
      description: "Be part of a vibrant student community in our shared spaces"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === roomImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === roomImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? roomImages.length - 1 : prevIndex - 1
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          ...(formData.role === 'student' ? { program: formData.program } : {})
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={roomImages[currentImageIndex].url}
          alt={roomImages[currentImageIndex].title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-bold mb-6">{roomImages[currentImageIndex].title}</h1>
          <p className="text-lg opacity-90 mb-8">
            {roomImages[currentImageIndex].description}
          </p>
          <div className="flex justify-between items-center">
            <button 
              onClick={prevImage}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <FaChevronLeft className="text-white text-xl" />
            </button>
            <div className="flex space-x-4">
              {roomImages.map((_, index) => (
                <div 
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button 
              onClick={nextImage}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <FaChevronRight className="text-white text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 bg-black overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 mb-8">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-gray-200 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium text-gray-300">
              <FaGoogle className="text-lg" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium text-gray-300">
              <FaGithub className="text-lg" />
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-500">Or continue with</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRegEnvelope className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="role" className="text-sm font-medium text-gray-300">
                I am registering as a:
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="block w-full py-3 px-4 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                required
              >
                <option value="student">Student</option>
                <option value="admin">Administrator</option>
                <option value="staff">Staff Member</option>
              </select>
            </div>

            {formData.role === 'student' && (
              <div className="space-y-1">
                <label htmlFor="program" className="text-sm font-medium text-gray-300">
                  Program of Study
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    required
                    className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                    placeholder="Enter your program"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 bg-gray-900 border-gray-800 rounded text-white focus:ring-white focus:ring-offset-gray-900"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the{' '}
                <a href="#" className="font-medium text-white hover:text-gray-200">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-white hover:text-gray-200">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 