import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Upload, MapPin, Camera } from 'lucide-react';

const ReportForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'Medium',
    image: null,
  });

  const categories = [
    'Infrastructure',
    'Roads',
    'Sanitation',
    'Parks',
    'Vandalism',
    'Public Safety',
    'Utilities',
    'Other'
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission with user info
    const reportData = {
      ...formData,
      submittedBy: user?.name,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      id: Date.now() // Simple ID generation for demo
    };
    console.log('Report submitted:', reportData);
    alert('Report submitted successfully! You will receive updates on its progress.');
    navigate('/my-reports');
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
            {/* Title */}
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

            {/* Category */}
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
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Description */}
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

            {/* Location */}
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

            {/* Priority */}
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

            {/* Image Upload */}
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
                        <div className="p-3 bg-primary-100 rounded-2xl mb-3 mx-auto w-fit">
                          <Upload className="h-6 w-6 text-primary-600" />
                        </div>
                        <span className="text-sm font-medium text-neutral-700">Click to upload a photo</span>
                        <span className="text-xs text-neutral-500 mt-2 block">PNG, JPG up to 10MB</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                size="lg"
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" className="px-8">
                Submit Report
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ReportForm;