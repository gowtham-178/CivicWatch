import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, Camera } from 'lucide-react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api';

const ReportForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'Medium',
    image: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
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
      formDataToSend.append('category', formData.category);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('priority', formData.priority);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token || localStorage.getItem('civicwatch_token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('Report submitted successfully! You will receive updates on its progress.');
        navigate('/my-reports');
      } else {
        setError(data.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-sm font-medium text-primary-700 mb-4">
          <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-bounce-subtle"></span>
          Community Reporting
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 via-primary-800 to-secondary-800 bg-clip-text text-transparent mb-4">Report an Issue</h1>
        <p className="text-lg text-neutral-600 max-w-xl mx-auto">Help improve your community by reporting issues that need attention.</p>
      </div>

      <Card className="shadow-large" hover>
        <Card.Content className="py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-neutral-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-neutral-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-neutral-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 resize-none"
                placeholder="Provide detailed information about the issue"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-neutral-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  placeholder="Street address or landmark"
                />
                <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Be as specific as possible to help responders locate the issue
              </p>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-neutral-700 mb-2">
                Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
              >
                <option value="Low">Low - Minor inconvenience</option>
                <option value="Medium">Medium - Moderate impact</option>
                <option value="High">High - Safety concern or major impact</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    {formData.image ? (
                      <div className="flex items-center justify-center space-x-3 text-accent-600">
                        <div className="p-2 bg-accent-100 rounded-xl">
                          <Camera className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-semibold">{formData.image.name}</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-primary-100 rounded-xl mb-3">
                          <Upload className="h-6 w-6 text-primary-600" />
                        </div>
                        <p className="text-sm font-semibold text-neutral-700 mb-1">Upload a photo</p>
                        <p className="text-xs text-neutral-500">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ReportForm;