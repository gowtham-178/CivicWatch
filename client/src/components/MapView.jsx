import React from 'react';
import { MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const MapView = ({ reports = [] }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-primary-100 via-white to-secondary-100 rounded-2xl overflow-hidden shadow-soft" style={{ height: '500px' }}>
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-200/30 to-accent-200/30">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,20 Q25,10 50,20 T100,20 L100,80 Q75,90 50,80 T0,80 Z" fill="url(#gradient1)" />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Street Grid */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full border-t border-neutral-300/20" style={{ top: `${i * 10}%` }} />
        ))}
        {[...Array(10)].map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full border-l border-neutral-300/20" style={{ left: `${i * 10}%` }} />
        ))}
      </div>

      {/* Report Pins */}
      {reports.map((report) => (
        <div
          key={report.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{
            left: `${20 + (report.id * 15) % 60}%`,
            top: `${20 + (report.id * 12) % 60}%`,
          }}
        >
          <div className={`w-8 h-8 rounded-full ${getPriorityColor(report.priority)} flex items-center justify-center shadow-medium group-hover:scale-125 transition-all duration-300 border-2 border-white`}>
            <MapPin className="h-4 w-4 text-white" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 glass-effect p-4 rounded-2xl shadow-large opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 w-72 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-neutral-900">{report.title}</h4>
              {getStatusIcon(report.status)}
            </div>
            <p className="text-xs text-neutral-600 mb-3 leading-relaxed">{report.description}</p>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500 font-medium">{report.category}</span>
              <span className={`px-3 py-1 rounded-full text-white font-medium ${getPriorityColor(report.priority)}`}>
                {report.priority}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 glass-effect p-4 rounded-2xl shadow-medium">
        <h4 className="font-bold text-sm mb-3 text-neutral-900">Priority Levels</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-xs font-medium text-neutral-700">High</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
            <span className="text-xs font-medium text-neutral-700">Medium</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-xs font-medium text-neutral-700">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;