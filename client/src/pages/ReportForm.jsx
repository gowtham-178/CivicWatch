import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, Camera, FileCheck, Locate } from 'lucide-react';
import Card from '../components/Card';
import SuccessModal from '../components/SuccessModal';
import { reportsAPI } from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.divIcon({
  html: `<div class="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center shadow-md border-2 border-white">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
         </div>`,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const ReportForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: ['General'],
    priority: 'Medium',
    image: null
  });

  const [selectedCoords, setSelectedCoords] = useState(null);
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const reverseGeocode = async (lat, lng) => {
    setResolvingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          setFormData((prev) => ({
            ...prev,
            location: data.display_name
          }));
        }
      }
    } catch (err) {
      console.error('Error reverse geocoding:', err);
    } finally {
      setResolvingAddress(false);
    }
  };

  const safeSetView = (map, coords, zoom) => {
    if (map && map._container && map._mapPane) {
      try {
        map.setView(coords, zoom);
      } catch (e) {
        console.warn('Map setView skipped safely:', e);
      }
    }
  };

  const handleRealign = () => {
    const map = mapRef.current;
    if (!map || !map._container || !map._mapPane) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mapRef.current !== map || !map._container) return;
          const { latitude, longitude } = position.coords;
          safeSetView(map, [latitude, longitude], 15);
          setSelectedCoords({ lat: latitude, lng: longitude });

          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude], { icon: markerIcon }).addTo(map);
          }
          reverseGeocode(latitude, longitude);
        },
        () => {
          if (mapRef.current !== map || !map._container) return;
          safeSetView(map, [16.4879, 80.6935], 15);
          setSelectedCoords({ lat: 16.4879, lng: 80.6935 });
          if (markerRef.current) {
            markerRef.current.setLatLng([16.4879, 80.6935]);
          } else {
            markerRef.current = L.marker([16.4879, 80.6935], { icon: markerIcon }).addTo(map);
          }
          reverseGeocode(16.4879, 80.6935);
        }
      );
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, { zoomControl: false });
    safeSetView(map, [16.4879, 80.6935], 13);
    mapRef.current = map;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mapRef.current !== map || !map._container) return;
          const { latitude, longitude } = position.coords;
          safeSetView(map, [latitude, longitude], 15);
          setSelectedCoords({ lat: latitude, lng: longitude });
          markerRef.current = L.marker([latitude, longitude], { icon: markerIcon }).addTo(map);
          reverseGeocode(latitude, longitude);
        },
        () => {
          if (mapRef.current !== map || !map._container) return;
          safeSetView(map, [16.4879, 80.6935], 15);
          setSelectedCoords({ lat: 16.4879, lng: 80.6935 });
          markerRef.current = L.marker([16.4879, 80.6935], { icon: markerIcon }).addTo(map);
          reverseGeocode(16.4879, 80.6935);
        }
      );
    }

    map.on('click', (e) => {
      if (!mapRef.current || !map._container) return;
      const { lat, lng } = e.latlng;
      setSelectedCoords({ lat, lng });

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
      }
      reverseGeocode(lat, lng);
    });

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.off();
          mapRef.current.remove();
        } catch (e) {}
        mapRef.current = null;
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', JSON.stringify(formData.category || ['General']));
      formDataToSend.append('location', formData.location);
      formDataToSend.append('priority', formData.priority);

      if (selectedCoords) {
        formDataToSend.append('latitude', selectedCoords.lat);
        formDataToSend.append('longitude', selectedCoords.lng);
      }

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const res = await reportsAPI.create(formDataToSend);
      if (res.success) {
        setShowSuccessModal(true);
      } else {
        setError(res.error || 'Failed to submit report');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      if (err.message && (err.message.includes('token') || err.message.includes('authorization') || err.message.includes('401'))) {
        setError('Your session token has expired or is invalid. Please sign out and sign in again to submit your report.');
      } else {
        setError(err.message || 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Report a Civic Issue</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">Fill in the details below to notify administrators and your local community.</p>
      </div>

      <Card>
        <Card.Content className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g. Overflowing waste bin near main market"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                placeholder="Describe the issue, hazards, or specific location details..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Pin Location on Map *
              </label>
              <div className="relative bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mb-3" style={{ height: '260px' }}>
                <div ref={mapContainerRef} className="w-full h-full z-0" />
                <button
                  type="button"
                  onClick={handleRealign}
                  className="absolute top-3 right-3 z-[1000] bg-white p-2 rounded-lg shadow border border-slate-200 hover:bg-slate-50 transition-colors"
                  title="Realign to current position"
                >
                  <Locate className="h-4 w-4 text-slate-600" />
                </button>
                {resolvingAddress && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[1000]">
                    <span className="text-xs font-medium text-slate-700 bg-white px-3 py-1.5 rounded-full shadow">
                      Resolving address...
                    </span>
                  </div>
                )}
              </div>

              <label htmlFor="location" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Address / Landmark *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Street address or landmark resolved from map"
                />
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 flex items-start space-x-3">
              <div className="text-xl">🤖</div>
              <div>
                <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">AI Auto-Categorization Active</h4>
                <p className="text-xs text-sky-700 mt-0.5">
                  Category & priority will be automatically detected and assigned by CivicWatch AI when you submit this report.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Attach Image (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:border-sky-400 transition-colors">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer">
                  {formData.image ? (
                    <div className="flex items-center justify-center space-x-2 text-sky-600 text-sm font-medium">
                      <Camera className="h-4 w-4" />
                      <span>{formData.image.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-700">Click to upload photo</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </Card.Content>
      </Card>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Report Submitted Successfully!"
        message="Thank you for helping improve your community. Your report has been recorded and submitted for municipal review."
        actionText="View My Reports"
        onAction={() => navigate('/my-reports')}
        icon={FileCheck}
      />
    </div>
  );
};

export default ReportForm;
