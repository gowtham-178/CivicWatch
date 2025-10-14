import React from 'react';
import { CheckCircle, X, ArrowRight } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, title, message, actionText, onAction, icon: Icon = CheckCircle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fade-in" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 animate-scale-up">
          <div>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 animate-bounce-subtle">
              <Icon className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-bold text-gray-900 mb-2">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 space-y-3">
            {onAction && (
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={onAction}
              >
                {actionText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              className="w-full inline-flex justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;