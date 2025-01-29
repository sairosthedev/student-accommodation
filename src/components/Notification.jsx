import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-500' : 'border-red-500';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`${bgColor} ${textColor} border-l-4 ${borderColor} p-4 rounded shadow-lg flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <p>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-opacity-20 hover:bg-black rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification; 