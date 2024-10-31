import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaEdit, FaTrashAlt } from 'react-icons/fa';
import api from '../services/api';

interface Event {
  id: number;
  title: string;
  date: string;
  rsvpCount: number;
  pendingCount: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [goingCount, setGoingCount] = useState(0);
  const [maybeCount, setMaybeCount] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        const eventsData = response.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date).toLocaleDateString(),
          rsvpCount: event.rsvpCount,
          pendingCount: event.pendingCount,
        }));
        setEvents(eventsData);

        // Fetch RSVP summary
        const rsvpSummary = await api.get('/rsvp/summary');
        const goingSummary = rsvpSummary.data.find((item: { response: string }) => item.response === 'GOING');
        const maybeSummary = rsvpSummary.data.find((item: { response: string }) => item.response === 'MAYBE');

        setGoingCount(goingSummary ? goingSummary.count : 0);
        setMaybeCount(maybeSummary ? maybeSummary.count : 0);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = () => navigate('/create-event');

  const handleEditEvent = (eventId: number) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await api.delete(`/events/${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Event Dashboard</h1>
        <button
          onClick={handleCreateEvent}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Create New Event
        </button>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Event List</h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map(event => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-green-600 font-semibold">{event.rsvpCount}</span>
                    <span className="text-gray-500"> / {event.pendingCount} pending</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">
                    <button onClick={() => navigate(`/event/${event.id}`)} className="text-blue-500 hover:text-blue-700">
                      <FaMapMarkerAlt /> {/* View Location */}
                    </button>
                    <button onClick={() => navigate(`/email-invite/${event.id}`)} className="text-green-500 hover:text-green-700">
                      <FaEnvelope /> {/* Send Invitation */}
                    </button>
                    <button onClick={() => handleEditEvent(event.id)} className="text-yellow-500 hover:text-yellow-700">
                      <FaEdit /> {/* Edit */}
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-700">
                      <FaTrashAlt /> {/* Delete */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">RSVP Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-700">Total Going</h3>
            <p className="text-2xl font-bold text-blue-900">{goingCount}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-700">Total Maybe</h3>
            <p className="text-2xl font-bold text-yellow-900">{maybeCount}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
