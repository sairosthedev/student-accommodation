import React, { useState, useEffect } from 'react';
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
  Wrench,
  X
} from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/use-auth';
import axios from 'axios';
import ErrorBoundary from '../common/ErrorBoundary';

const ChatList = ({ chats, loading, error, selectedChat, setSelectedChat, isMobile }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Loading chats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!Array.isArray(chats) || chats.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">No chats found</div>
      </div>
    );
  }

  return chats.map((chat) => (
    <div
      key={chat.chatRoom}
      onClick={() => setSelectedChat(chat.chatRoom)}
      className={cn(
        "p-4 cursor-pointer transition-colors duration-200",
        isMobile && "p-3",
        selectedChat === chat.chatRoom ? 'bg-gray-50' : 'hover:bg-gray-50'
      )}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar
            name={chat.latestMessage?.receiver?.email}
            size={isMobile ? "sm" : "md"}
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-400`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "font-semibold text-gray-900 truncate",
              isMobile ? "text-sm" : "text-base"
            )}>
              {chat.latestMessage?.receiver?.email}
            </h3>
            <p className="text-xs text-gray-500">
              {chat.latestMessage?.createdAt ? new Date(chat.latestMessage.createdAt).toLocaleDateString() : ''}
            </p>
          </div>
          <p className={cn(
            "text-gray-500 truncate",
            isMobile ? "text-xs" : "text-sm"
          )}>{chat.latestMessage?.content}</p>
        </div>
        {chat.unreadCount > 0 && (
          <Badge
            colorScheme="gray"
            className={cn(
              "bg-black text-white rounded-full px-2 py-1",
              isMobile ? "text-[10px]" : "text-xs"
            )}
          >
            {chat.unreadCount}
          </Badge>
        )}
      </div>
    </div>
  ));
};

const CommunicationHub = () => {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState(null);
  const [newAnnouncementsCount, setNewAnnouncementsCount] = useState(0);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchUserTerm, setSearchUserTerm] = useState('');
  const toast = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/messages/chats');
        const chatData = response.data;
        
        // Ensure chats is always an array
        setChats(Array.isArray(chatData) ? chatData : []);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError(error.message);
        toast({
          title: 'Error fetching chats',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  // Fetch messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const response = await axios.get(`/api/messages/chat/${selectedChat}`);
        setMessages(response.data);

        // Mark messages as read
        await axios.put(`/api/messages/read/${selectedChat}`);
      } catch (error) {
        toast({
          title: 'Error fetching messages',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('/api/messages/unread');
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
  }, []);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setAnnouncementsLoading(true);
        setAnnouncementsError(null);
        const response = await axios.get('/api/announcements', {
          params: {
            status: 'published',
            limit: 10
          }
        });
        
        // The response.data contains the announcements directly
        const announcementData = Array.isArray(response.data) ? response.data : [];
        setAnnouncements(announcementData);
        
        // Calculate new announcements (posted in the last 24 hours)
        const newCount = announcementData.filter(announcement => {
          const announcementDate = new Date(announcement.createdAt);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return announcementDate > yesterday;
        }).length;
        
        setNewAnnouncementsCount(newCount);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setAnnouncementsError(error.message);
        toast({
          title: 'Error fetching announcements',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setAnnouncementsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Fetch available users for new chat
  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get('/api/users/available');
      setAvailableUsers(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNewChat = () => {
    fetchAvailableUsers();
    setShowNewChatModal(true);
  };

  const handleStartChat = async () => {
    if (!selectedUser) return;

    try {
      // Create a new chat room
      const response = await axios.post('/api/messages/create-room', {
        receiverId: selectedUser._id
      });

      // Add the new chat to the list
      setChats(prev => [...prev, response.data]);
      
      // Select the new chat
      setSelectedChat(response.data.chatRoom);
      
      // Close the modal
      setShowNewChatModal(false);
      setSelectedUser(null);
      
      toast({
        title: 'Chat created!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating chat',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearchUsers = (e) => {
    setSearchUserTerm(e.target.value);
    // Filter available users based on search term
    const filtered = availableUsers.filter(user => 
      user.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setAvailableUsers(filtered);
  };

  const handleViewAnnouncement = (announcementId) => {
    // Open announcement in a modal instead of navigating away
    const announcement = announcements.find(a => a._id === announcementId);
    if (announcement) {
      toast({
        title: announcement.title,
        description: announcement.content,
        status: 'info',
        duration: 10000,
        isClosable: true,
        position: 'top',
        render: ({ onClose }) => (
          <Box p={6} bg="white" rounded="lg" shadow="lg">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{announcement.title}</h3>
              <IconButton
                size="sm"
                variant="ghost"
                icon={<X className="h-4 w-4" />}
                onClick={onClose}
              />
            </div>
            <Badge
              className={cn(
                "mt-2 rounded-full px-2 py-1",
                getPriorityColor(announcement.priority)
              )}
            >
              {announcement.priority}
            </Badge>
            <p className="mt-4 text-gray-600">{announcement.content}</p>
            <div className="mt-4 text-sm text-gray-500">
              Posted by {getAuthorName(announcement.author)} on {new Date(announcement.createdAt).toLocaleDateString()}
            </div>
          </Box>
        ),
      });
    }
  };

  const handleCallEmergency = (contact) => {
    // Show confirmation dialog before calling
    if (window.confirm(`Are you sure you want to call ${contact.name}?`)) {
      window.location.href = `tel:${contact.number}`;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      const response = await axios.post('/api/messages', {
        content: message,
        chatRoom: selectedChat,
        receiverId: chats.find(chat => chat.chatRoom === selectedChat)?.latestMessage?.receiver?._id
      });

      setMessages(prev => [...prev, response.data]);
      setMessage('');
      
      toast({
        title: 'Message sent!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
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

  // Helper function to get author display name
  const getAuthorName = (author) => {
    if (!author) return 'Unknown';
    return author.name || author.email || 'Unknown';
  };

  const renderChatInterface = () => {
    if (!selectedChat) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
          <MessageSquare className="h-12 w-12 mb-4" />
          <p className="text-lg font-semibold">Select a chat to start messaging</p>
          <p className="text-sm">Choose from your existing conversations or start a new one</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center space-x-4">
            <Avatar
              name={chats.find(chat => chat.chatRoom === selectedChat)?.latestMessage?.receiver?.email}
              size={isMobile ? "sm" : "md"}
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {chats.find(chat => chat.chatRoom === selectedChat)?.latestMessage?.receiver?.email}
              </h3>
              <p className="text-sm text-gray-500">
                {chats.find(chat => chat.chatRoom === selectedChat)?.latestMessage?.receiver?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={cn(
                "flex items-start space-x-2",
                msg.sender._id === user?._id ? "flex-row-reverse space-x-reverse" : "flex-row"
              )}
            >
              <Avatar
                name={msg.sender.email}
                size="sm"
                className="mt-1"
              />
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  msg.sender._id === user?._id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <IconButton
              aria-label="Send message"
              icon={<Send className="h-5 w-5" />}
              onClick={handleSendMessage}
              colorScheme="gray"
              variant="solid"
              className="bg-black text-white hover:bg-gray-900"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className={cn(
          "container mx-auto px-4 py-8",
          isMobile ? "max-w-full" : "max-w-7xl"
        )}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>Communication Hub</h1>
              <p className="text-sm text-gray-600 mt-1">Stay connected with administrators, staff, and fellow students</p>
            </div>
            <button
              onClick={handleNewChat}
              className={cn(
                "inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900",
                isMobile ? "mt-4 w-full justify-center" : ""
              )}
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>New Message</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className={cn(
            "grid gap-6 mb-8",
            isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-4"
          )}>
            <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className={cn("text-gray-600", isMobile ? "text-xs" : "text-sm")}>Unread Messages</p>
                  <p className={cn("font-bold text-gray-900", isMobile ? "text-xl" : "text-2xl")}>{unreadCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className={cn("text-gray-600", isMobile ? "text-xs" : "text-sm")}>Active Chats</p>
                  <p className={cn("font-bold text-gray-900", isMobile ? "text-xl" : "text-2xl")}>{chats.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Bell className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className={cn("text-gray-600", isMobile ? "text-xs" : "text-sm")}>Announcements</p>
                  <p className={cn("font-bold text-gray-900", isMobile ? "text-xl" : "text-2xl")}>
                    {newAnnouncementsCount} New
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className={cn("text-gray-600", isMobile ? "text-xs" : "text-sm")}>Support</p>
                  <p className={cn("font-bold text-gray-900", isMobile ? "text-xl" : "text-2xl")}>24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "grid gap-8",
            isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
          )}>
            {/* Chat Section */}
            <div className="space-y-8">
              {/* Messages */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className={cn(
                  "p-6 border-b border-gray-100",
                  isMobile && "p-4"
                )}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className={cn("font-bold text-gray-900", isMobile ? "text-lg" : "text-2xl")}>Messages</h2>
                      <p className="text-gray-600 mt-2">Chat with support and other students</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleNewChat}
                      className={cn(
                        "inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900",
                        isMobile ? "mt-4 w-full justify-center" : ""
                      )}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      <span>New Chat</span>
                    </Button>
                  </div>
                </div>

                <div className="border-b border-gray-100">
                  <div className={cn("p-4", isMobile && "p-3")}>
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
                  <ChatList
                    chats={chats}
                    loading={loading}
                    error={error}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    isMobile={isMobile}
                  />
                </div>

                {/* Chat Interface */}
                <div className="h-[500px] border-t border-gray-100">
                  {renderChatInterface()}
                </div>
              </div>
            </div>

            {/* Announcements and Emergency Contacts */}
            <div className="space-y-8">
              {/* Announcements */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className={cn(
                  "p-6 border-b border-gray-100",
                  isMobile && "p-4"
                )}>
                  <h2 className={cn("font-bold text-gray-900", isMobile ? "text-lg" : "text-2xl")}>Announcements</h2>
                  <p className="text-gray-600 mt-2">Important updates and notifications</p>
                </div>
                
                <div className={cn("p-6", isMobile && "p-4")}>
                  {announcementsLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="text-gray-500">Loading announcements...</div>
                    </div>
                  ) : announcementsError ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="text-red-500">Error: {announcementsError}</div>
                    </div>
                  ) : announcements.length === 0 ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="text-gray-500">No announcements found</div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {announcements.map((announcement) => (
                        <div key={announcement._id} className={cn(
                          "bg-gray-50 rounded-lg",
                          isMobile ? "p-4" : "p-6"
                        )}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gray-100 p-2 rounded-lg">
                                {getCategoryIcon(announcement.category)}
                              </div>
                              <div>
                                <h3 className={cn(
                                  "font-semibold text-gray-900",
                                  isMobile ? "text-sm" : "text-base"
                                )}>{announcement.title}</h3>
                                <p className="text-sm text-gray-500">{getAuthorName(announcement.author)}</p>
                              </div>
                            </div>
                            <Badge
                              colorScheme="gray"
                              className={cn(
                                `rounded-full px-3 py-1 ${getPriorityColor(announcement.priority)}`,
                                isMobile && "text-xs"
                              )}
                            >
                              {announcement.priority}
                            </Badge>
                          </div>
                          <p className={cn(
                            "text-gray-600 mb-4",
                            isMobile ? "text-sm" : "text-base"
                          )}>{announcement.content}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                            <Button
                              size={isMobile ? "xs" : "sm"}
                              variant="ghost"
                              className="text-gray-600 hover:text-black"
                              onClick={() => handleViewAnnouncement(announcement._id)}
                            >
                              Read More
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className={cn(
                  "p-6 border-b border-gray-100",
                  isMobile && "p-4"
                )}>
                  <h2 className={cn("font-bold text-gray-900", isMobile ? "text-lg" : "text-2xl")}>Emergency Contacts</h2>
                  <p className="text-gray-600 mt-2">24/7 support for urgent situations</p>
                </div>
                
                <div className={cn("p-6", isMobile && "p-4")}>
                  {emergencyContacts.map((contact) => (
                    <div key={contact.id} className={cn(
                      "bg-gray-50 rounded-lg mb-4 last:mb-0",
                      isMobile ? "p-4" : "p-6"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <Phone className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className={cn(
                              "font-semibold text-gray-900",
                              isMobile ? "text-sm" : "text-base"
                            )}>{contact.name}</h3>
                            <p className={cn(
                              "font-bold text-gray-900",
                              isMobile ? "text-base" : "text-lg"
                            )}>{contact.number}</p>
                          </div>
                        </div>
                        <IconButton
                          aria-label="Call emergency contact"
                          icon={<Phone className={cn("h-5 w-5", isMobile && "h-4 w-4")} />}
                          colorScheme="gray"
                          variant="outline"
                          size={isMobile ? "sm" : "md"}
                          onClick={() => handleCallEmergency(contact)}
                          className="rounded-full hover:bg-gray-100"
                        />
                      </div>
                      <p className={cn(
                        "text-gray-600 mb-2",
                        isMobile ? "text-xs" : "text-sm"
                      )}>{contact.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className={cn(
                          "text-gray-500",
                          isMobile && "text-xs"
                        )}>Available: {contact.available}</span>
                        <Badge colorScheme="gray" className={cn(
                          "bg-black text-white",
                          isMobile ? "text-xs" : "text-sm"
                        )}>Response: {contact.response}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">New Conversation</h3>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    icon={<X className="h-4 w-4" />}
                    onClick={() => setShowNewChatModal(false)}
                  />
                </div>
                
                <Input
                  placeholder="Search users..."
                  value={searchUserTerm}
                  onChange={handleSearchUsers}
                  className="mb-4"
                />
                
                <div className="max-h-60 overflow-y-auto">
                  {availableUsers.map(user => (
                    <div
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer",
                        selectedUser?._id === user._id ? "bg-gray-100" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar name={user.name || user.email} size="sm" />
                        <div>
                          <p className="font-medium">{user.name || user.email}</p>
                          <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewChatModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStartChat}
                    disabled={!selectedUser}
                    className="bg-black text-white hover:bg-gray-900"
                  >
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CommunicationHub; 