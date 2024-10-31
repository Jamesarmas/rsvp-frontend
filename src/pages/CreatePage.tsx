import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


// Define the type for the event details
interface EventDetails {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
}

const CreateEvent: React.FC = () => {
  const [event, setEvent] = useState<EventDetails>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    latitude: null,
    longitude: null,
  });
  const {userId} = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const locationName = response.data.results[0]?.formatted_address || 'Unknown location';
      setEvent((prevEvent) => ({ ...prevEvent, location: locationName }));
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      setEvent({ ...event, latitude: lat, longitude: lng });
      fetchLocationName(lat, lng);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.post('/events', {
        ...event,
        date: `${event.date}T${event.time}`,
        organizerId: userId
      });
      console.log('Event created successfully:', response.data);
      setEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        latitude: null,
        longitude: null,
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error saving event:', error);
      alert('There was an issue creating the event.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create Event</h2>

      <form className="space-y-4">
        <div>
          <label className="block text-gray-700">Event Name</label>
          <input
            type="text"
            name="title"
            value={event.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            placeholder="Enter event name"
          />
        </div>

        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={event.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            placeholder="Enter event description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={event.time}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
          <GoogleMap
            center={{ lat: 0, lng: 0 }}
            zoom={2}
            onClick={handleMapClick}
            mapContainerClassName="w-full h-64 mb-4 border rounded"
          >
            {event.latitude && event.longitude && (
              <Marker
                position={{ lat: event.latitude, lng: event.longitude }}
                title="Selected Location"
              />
            )}
          </GoogleMap>
        </LoadScript>

        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
        >
          Save Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
