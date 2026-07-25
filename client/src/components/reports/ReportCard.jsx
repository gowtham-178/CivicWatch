import React from 'react';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { ThumbsUp, MessageSquare, MapPin, Calendar, User } from 'lucide-react';
import { API_SERVER_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

export const ReportCard = ({ report, onUpvote, onViewDetails, showAdminControls = false, onStatusChange }) => {
  const { user } = useAuth();
  if (!report) return null;

  const isAdmin = user?.role === 'admin';
  const canModifyStatus = showAdminControls && isAdmin && onStatusChange;

  const categories = Array.isArray(report.category) ? report.category : [report.category || 'General'];
  const hasImage = report.images && report.images.length > 0;
  const imageUrl = hasImage ? `${API_SERVER_URL}${report.images[0]}` : null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-100 overflow-hidden flex flex-col justify-between">
      {hasImage && (
        <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
          <img
            src={imageUrl}
            alt={report.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <StatusBadge status={report.status} />
          </div>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            {!hasImage && <StatusBadge status={report.status} />}
            <PriorityBadge priority={report.priority} />
          </div>

          <h3 className="text-lg font-semibold text-slate-800 line-clamp-1 mb-2">
            {report.title}
          </h3>

          <p className="text-slate-600 text-sm line-clamp-2 mb-4">
            {report.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {categories.map((cat, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md font-medium">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[140px]">{report.location?.address || 'Location provided'}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recently'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{report.submittedBy?.name || 'Citizen'}</span>
            </span>
          </div>

          {canModifyStatus && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-700">Update Status:</span>
              <select
                value={report.status}
                onChange={(e) => onStatusChange(report._id, e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              {onUpvote && (
                <button
                  onClick={() => onUpvote(report._id)}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-sky-600 transition-colors font-medium"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{report.upvotes?.length || 0}</span>
                </button>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MessageSquare className="w-4 h-4" />
                <span>{report.comments?.length || 0}</span>
              </span>
            </div>

            {onViewDetails && (
              <button
                onClick={() => onViewDetails(report)}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
              >
                View Details ➔
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
