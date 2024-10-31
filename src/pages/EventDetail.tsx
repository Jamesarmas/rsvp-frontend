import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface EventDetails {
  title: string;
  description: string;
  date: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (!event) return <p className="text-center text-gray-500">Event not found</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">{event.title}</h2>
        <p className="mb-4 text-gray-700">{event.description}</p>
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-600">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="font-semibold text-gray-600">
              <strong>Location:</strong> {event.location}
            </p>
          </div>
        </div>
        {event.latitude && event.longitude && (
          <div className="mt-6">
            <strong className="text-gray-800">Map:</strong>
            <div className="w-full h-64 border rounded-lg overflow-hidden shadow">
              <iframe
                title="event location"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`}
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
