import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Select,
  Image,
  SimpleGrid,
  Progress,
  Badge,
} from '@chakra-ui/react';
import { 
  Wrench, 
  Upload, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Camera,
  Star,
  Calendar
} from 'lucide-react';

const MaintenanceRequest = () => {
  const [request, setRequest] = useState({
    title: '',
    description: '',
    priority: '',
    location: '',
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const recentRequests = [
    {
      id: 1,
      title: 'Broken Light Fixture',
      status: 'in-progress',
      progress: 60,
      location: 'Room 301',
      date: '2024-03-15',
      priority: 'medium'
    },
    {
      id: 2,
      title: 'AC Not Working',
      status: 'pending',
      progress: 0,
      location: 'Room 301',
      date: '2024-03-14',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Door Lock Issue',
      status: 'completed',
      progress: 100,
      location: 'Room 301',
      date: '2024-03-10',
      priority: 'low'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setRequest(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Integrate with backend API
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        toast({
          title: 'Maintenance request submitted!',
          description: 'We will process your request soon.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setRequest({
          title: '',
          description: '',
          priority: '',
          location: '',
          images: [],
        });
      }
    } catch (error) {
      toast({
        title: 'Error submitting request',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'yellow';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Maintenance Requests
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl">
              Submit and track maintenance issues for quick resolution
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Wrench className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Resolution</p>
                <p className="text-2xl font-bold text-gray-900">2 Days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Request Form */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Submit New Request</h2>
              <p className="text-gray-600 mt-2">Report maintenance issues in your accommodation</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <FormControl isRequired>
                  <FormLabel className="text-gray-700">Issue Title</FormLabel>
                  <Input
                    name="title"
                    value={request.title}
                    onChange={handleChange}
                    placeholder="e.g., Broken Light Fixture"
                    className="w-full rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel className="text-gray-700">Location</FormLabel>
                  <Input
                    name="location"
                    value={request.location}
                    onChange={handleChange}
                    placeholder="e.g., Room 301, Bathroom"
                    className="w-full rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel className="text-gray-700">Priority Level</FormLabel>
                  <Select
                    name="priority"
                    value={request.priority}
                    onChange={handleChange}
                    placeholder="Select priority level"
                    className="w-full rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="low">Low - Non-urgent issue</option>
                    <option value="medium">Medium - Affects comfort</option>
                    <option value="high">High - Affects daily activities</option>
                    <option value="emergency">Emergency - Immediate attention needed</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel className="text-gray-700">Description</FormLabel>
                  <Textarea
                    name="description"
                    value={request.description}
                    onChange={handleChange}
                    placeholder="Please describe the issue in detail..."
                    rows={4}
                    className="w-full rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel className="text-gray-700">Upload Images</FormLabel>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="images" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                          <span>Upload images</span>
                          <Input
                            id="images"
                            name="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </FormControl>

                {request.images.length > 0 && (
                  <SimpleGrid columns={3} spacing={2} className="mt-4">
                    {request.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`Uploaded image ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setRequest(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-white hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </SimpleGrid>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    colorScheme="green"
                    size="lg"
                    isLoading={loading}
                    loadingText="Submitting..."
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Recent Requests */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Recent Requests</h2>
                <p className="text-gray-600 mt-2">Track the status of your maintenance requests</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {recentRequests.map((req) => (
                    <div key={req.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`bg-${getStatusColor(req.status)}-100 p-2 rounded-lg`}>
                            <Wrench className={`h-5 w-5 text-${getStatusColor(req.status)}-600`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{req.title}</h3>
                            <p className="text-sm text-gray-500">{req.location}</p>
                          </div>
                        </div>
                        <Badge colorScheme={getPriorityColor(req.priority)} className="rounded-full px-3 py-1">
                          {req.priority}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status</span>
                          <Badge colorScheme={getStatusColor(req.status)} className="rounded-full px-3 py-1">
                            {req.status}
                          </Badge>
                        </div>
                        
                        <Progress
                          value={req.progress}
                          size="sm"
                          colorScheme={getStatusColor(req.status)}
                          className="rounded-full"
                        />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Submitted on {req.date}</span>
                          {req.status === 'completed' && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-gray-600">Rate service</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequest; 