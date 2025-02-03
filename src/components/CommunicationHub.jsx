import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  useToast,
  Avatar,
  Badge,
  IconButton,
  Textarea,
} from '@chakra-ui/react';
import { 
  MessageSquare, 
  Bell, 
  Phone, 
  Send,
  Users,
  AlertCircle,
  Calendar,
  ChevronRight,
  Search,
  Plus,
  Star,
  Info,
  Wrench
} from 'lucide-react';

const CommunicationHub = () => {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const chats = [
    {
      id: 1,
      name: 'Admin Support',
      lastMessage: 'How can I help you today?',
      unread: 2,
      type: 'admin',
      avatar: null,
      lastActive: '5m ago',
      status: 'online'
    },
    {
      id: 2,
      name: 'Floor 3 Group',
      lastMessage: 'Movie night this weekend!',
      unread: 0,
      type: 'group',
      avatar: null,
      lastActive: '2h ago',
      members: 15,
      status: 'active'
    },
    {
      id: 3,
      name: 'Maintenance Team',
      lastMessage: 'Your request has been processed',
      unread: 1,
      type: 'support',
      avatar: null,
      lastActive: '1h ago',
      status: 'online'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Maintenance Schedule',
      content: 'Regular maintenance check scheduled for March 20th, 2024. Our team will inspect all common areas and essential facilities.',
      date: '2024-03-15',
      priority: 'high',
      author: 'Facility Management',
      category: 'maintenance'
    },
    {
      id: 2,
      title: 'Community Event',
      content: 'Join us for the Spring Welcome Party this Saturday! There will be food, music, and a chance to meet your neighbors.',
      date: '2024-03-10',
      priority: 'medium',
      author: 'Student Council',
      category: 'event'
    },
    {
      id: 3,
      title: 'Holiday Schedule',
      content: 'Please note the modified reception hours during the upcoming holiday season.',
      date: '2024-03-08',
      priority: 'low',
      author: 'Administration',
      category: 'info'
    }
  ];

  const emergencyContacts = [
    {
      id: 1,
      name: 'Building Security',
      number: '123-456-7890',
      available: '24/7',
      description: 'For immediate security concerns and emergencies',
      response: 'Immediate'
    },
    {
      id: 2,
      name: 'Maintenance Emergency',
      number: '123-456-7891',
      available: '24/7',
      description: 'For urgent maintenance issues (water, electricity, etc.)',
      response: '< 30 mins'
    },
    {
      id: 3,
      name: 'Resident Advisor',
      number: '123-456-7892',
      available: '9 AM - 10 PM',
      description: 'For general assistance and student support',
      response: '< 2 hours'
    }
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // TODO: Integrate with messaging API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          chatId: selectedChat,
        }),
      });

      if (response.ok) {
        setMessage('');
        toast({
          title: 'Message sent!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'maintenance': return <Wrench className="h-5 w-5 text-blue-600" />;
      case 'event': return <Calendar className="h-5 w-5 text-purple-600" />;
      case 'info': return <Info className="h-5 w-5 text-gray-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Communication Hub</h1>
            <p className="text-sm text-gray-600 mt-1">Stay connected with administrators, staff, and fellow students</p>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>New Message</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Chats</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Announcements</p>
                <p className="text-2xl font-bold text-gray-900">2 New</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Support</p>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chat Section */}
          <div className="space-y-8">
            {/* Messages */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                    <p className="text-gray-600 mt-2">Chat with support and other students</p>
                  </div>
                  <Button
                    variant="outline"
                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    <span>New Chat</span>
                  </Button>
                </div>
              </div>

              <div className="border-b border-gray-100">
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search messages..."
                      className="pl-10 w-full rounded-lg border-gray-200 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 cursor-pointer transition-colors duration-200 ${
                      selectedChat === chat.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar
                          name={chat.name}
                          src={chat.avatar}
                          size="md"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          chat.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {chat.name}
                          </h3>
                          <p className="text-xs text-gray-500">{chat.lastActive}</p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                        {chat.type === 'group' && (
                          <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{chat.members} members</span>
                          </div>
                        )}
                      </div>
                      {chat.unread > 0 && (
                        <Badge
                          colorScheme="gray"
                          className="bg-black text-white rounded-full px-2 py-1 text-xs"
                        >
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Announcements and Emergency Contacts */}
          <div className="space-y-8">
            {/* Announcements */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                <p className="text-gray-600 mt-2">Important updates and notifications</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            {getCategoryIcon(announcement.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                            <p className="text-sm text-gray-500">{announcement.author}</p>
                          </div>
                        </div>
                        <Badge
                          colorScheme="gray"
                          className={`rounded-full px-3 py-1 ${getPriorityColor(announcement.priority)}`}
                        >
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{announcement.content}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Posted on {announcement.date}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:text-black"
                        >
                          Read More
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
                <p className="text-gray-600 mt-2">24/7 support for urgent situations</p>
              </div>
              
              <div className="p-6">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="bg-gray-50 rounded-lg p-6 mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                          <p className="text-lg font-bold text-gray-900">{contact.number}</p>
                        </div>
                      </div>
                      <IconButton
                        aria-label="Call emergency contact"
                        icon={<Phone className="h-5 w-5" />}
                        colorScheme="gray"
                        variant="outline"
                        onClick={() => {
                          window.location.href = `tel:${contact.number}`;
                        }}
                        className="rounded-full hover:bg-gray-100"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Available: {contact.available}</span>
                      <Badge colorScheme="gray" className="bg-black text-white">Response: {contact.response}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub; 