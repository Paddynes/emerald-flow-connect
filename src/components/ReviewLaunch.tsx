
import React from 'react';
import { Link } from 'react-router-dom';

interface ReviewLaunchProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const ReviewLaunch = ({ data, onUpdate }: ReviewLaunchProps) => {
  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Campaign Overview</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Campaign Name:</span>
              <div className="font-medium text-black">{data.name}</div>
            </div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Description:</span>
              <div className="text-black">{data.description || 'No description'}</div>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Total Steps:</span>
              <div className="font-medium text-black">4 modules</div>
            </div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Estimated Duration:</span>
              <div className="text-black">5-7 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Summary */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Contacts</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-emerald-500">247</span>
            <span className="text-gray-500 ml-2">contacts selected</span>
          </div>
          <button className="text-sm text-emerald-600 hover:text-emerald-700">
            View Details
          </button>
        </div>
      </div>

      {/* Schedule Summary */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Schedule & Limits</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Start Time:</span>
              <div className="font-medium text-black">
                {data.schedule === 'immediately' ? 'Immediately' : data.scheduledDate}
              </div>
            </div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Working Hours:</span>
              <div className="text-black">
                {data.workingHours.startTime} - {data.workingHours.endTime}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Daily Limits:</span>
              <div className="text-black">
                {data.rateLimits.connectionsPerDay} connections, {data.rateLimits.messagesPerDay} messages
              </div>
            </div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Estimated Daily Actions:</span>
              <div className="text-black">{data.rateLimits.totalActionsPerDay} actions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Check */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Safety Check</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-black">Rate limits configured safely</span>
          </div>
          <div className="flex items-center">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-black">Messages personalized with variables</span>
          </div>
          <div className="flex items-center">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-black">Working hours configured</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-2">⚠️</span>
            <span className="text-black">Remember to monitor campaign performance</span>
          </div>
        </div>
      </div>

      {/* LinkedIn Status */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">LinkedIn Connection</h3>
        <div className={`p-4 border-2 ${
          data.linkedinConnected 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-red-500 bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`text-2xl mr-3 ${
                data.linkedinConnected ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {data.linkedinConnected ? '✓' : '✗'}
              </span>
              <div>
                <div className={`font-medium ${
                  data.linkedinConnected ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  LinkedIn {data.linkedinConnected ? 'Connected' : 'Not Connected'}
                </div>
                {data.linkedinConnected && (
                  <div className="text-sm text-emerald-600">
                    Connected as: John Doe
                  </div>
                )}
              </div>
            </div>
            {!data.linkedinConnected && (
              <Link
                to="/linkedin-connect"
                className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                Configure
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewLaunch;
