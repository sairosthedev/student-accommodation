import axios from 'axios';
import { BACKEND_URL } from '../urls';

export const createNotification = async (userId, title, message, type = 'info') => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/notifications`,
      {
        userId,
        title,
        message,
        type
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Predefined notification creators for common scenarios
export const notifyMaintenanceRequest = async (userId, requestId) => {
  return createNotification(
    userId,
    'Maintenance Request Update',
    `Your maintenance request #${requestId} has been received and is being processed.`,
    'info'
  );
};

export const notifyPaymentDue = async (userId, amount, dueDate) => {
  return createNotification(
    userId,
    'Payment Due',
    `You have a payment of $${amount} due on ${new Date(dueDate).toLocaleDateString()}.`,
    'warning'
  );
};

export const notifyPaymentReceived = async (userId, amount) => {
  return createNotification(
    userId,
    'Payment Received',
    `Your payment of $${amount} has been received and processed.`,
    'success'
  );
};

export const notifyRoomAssigned = async (userId, roomNumber) => {
  return createNotification(
    userId,
    'Room Assignment',
    `You have been assigned to room ${roomNumber}.`,
    'success'
  );
};

export const notifyApplicationStatus = async (userId, status) => {
  return createNotification(
    userId,
    'Application Status Update',
    `Your application status has been updated to: ${status}`,
    status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info'
  );
};

export const notifyMaintenanceComplete = async (userId, requestId) => {
  return createNotification(
    userId,
    'Maintenance Complete',
    `Maintenance request #${requestId} has been completed.`,
    'success'
  );
};

export const notifyAnnouncement = async (userId, title, content) => {
  return createNotification(
    userId,
    'New Announcement',
    `${title}: ${content}`,
    'info'
  );
};

export const notifyRoomInspection = async (userId, date) => {
  return createNotification(
    userId,
    'Upcoming Room Inspection',
    `Your room is scheduled for inspection on ${new Date(date).toLocaleDateString()}.`,
    'warning'
  );
}; 