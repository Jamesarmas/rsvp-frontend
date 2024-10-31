import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const EmailInvite: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSendInvite = async () => {
    try {
      const response = await api.post(`/events/${eventId}/invite`, {
        email: recipientEmail,
      });
      setStatus(response.data.message);
    } catch (error) {
      console.error('Error sending invite:', error);
      setStatus('Failed to send invitation.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Send Event Invitation</h2>
        <p className="text-center mb-4 text-gray-600">Enter the recipient's email to send an invitation:</p>

        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="Recipient's email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />

        <button
          onClick={handleSendInvite}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Send Invitation
        </button>

        {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
      </div>
    </div>
  );
};

export default EmailInvite;
