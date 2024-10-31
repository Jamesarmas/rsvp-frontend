import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

enum ResponseType {
  GOING = 'GOING',
  MAYBE = 'MAYBE',
  NOT_GOING = 'NOT_GOING',
}

const RsvpPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the event ID from URL params
  const { userId } = useAuth(); // Get user ID from context
  const [event, setEvent] = useState<any>(null); // State to hold event details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`); // Fetch event details
        setEvent(response.data); // Set the event data in state
      } catch (err) {
        setError('Error fetching event details'); // Handle error
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchEvent(); // Fetch event on component mount
  }, [id]);

  const handleRsvp = async (response: ResponseType) => {
    try {
      await api.post(`/events/${id}/rsvp`, { userId, response }); // Send RSVP to the backend
      alert('RSVP submitted successfully!'); // Show success message
    } catch (err) {
      alert('Error submitting RSVP'); // Handle error
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading indicator
  if (error) return <div>{error}</div>; // Show error message

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">{event.title}</h2>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Location: {event.location}</p>
      <div className="mt-4">
        <button
          onClick={() => handleRsvp(ResponseType.GOING)} // Use enum value directly
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
        >
          Going
        </button>
        <button
          onClick={() => handleRsvp(ResponseType.MAYBE)} // Use enum value directly
          className="bg-yellow-500 text-white py-2 px-4 rounded mr-2"
        >
          Maybe
        </button>
        <button
          onClick={() => handleRsvp(ResponseType.NOT_GOING)} // Use enum value directly
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Not Going
        </button>
      </div>
    </div>
  );
};

export default RsvpPage;
