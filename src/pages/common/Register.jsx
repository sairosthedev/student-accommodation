import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaGithub, FaRegEnvelope, FaLock, FaChevronLeft, FaChevronRight, FaUser, FaPhone } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { verifyApplicationCode, register } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    applicationCode: '',
    phone: ''
  });

  const roomImages = [
    {
      url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3",
      title: "Start Your Journey",
      description: "Join our vibrant student community today"
    },
    {
      url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3",
      title: "Modern Living Spaces",
      description: "Experience comfort in our well-designed accommodations"
    },
    {
      url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3",
      title: "Study in Style",
      description: "Perfect environments for academic success"
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (!formData.applicationCode.match(/^APP-\d{4}-[A-Z0-9]{5}$/)) {
      toast.error("Invalid application code format");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Proceed with registration
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        applicationCode: formData.applicationCode
      });

      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Invalid application code')) {
        toast.error('Invalid application code. Please check your application code and try again.');
      } else if (error.message.includes('User already exists')) {
        toast.error('An account with this email already exists. Please log in instead.');
      } else if (error.message.includes('Missing required application information')) {
        toast.error('Your application information is incomplete. Please contact support.');
      } else if (error.message.includes('Application data is incomplete')) {
        toast.error('Your application details are incomplete. Please contact support.');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                    placeholder="First"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                    placeholder="Last"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRegEnvelope className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Application Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="applicationCode"
                  value={formData.applicationCode}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border bg-gray-900 border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Enter your application code"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter the code sent to your email (e.g., APP-2024-ABC12)</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-black rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-white hover:text-gray-200">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-white hover:text-gray-200">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 