
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LinkedInConnect = () => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    setErrorMessage('');

    // Simulate connection process
    setTimeout(() => {
      // Mock successful connection (90% success rate)
      if (Math.random() > 0.1) {
        setConnectionStatus('connected');
        // Auto-redirect after success
        setTimeout(() => {
          navigate(-1); // Go back to previous page
        }, 2000);
      } else {
        setConnectionStatus('error');
        setErrorMessage('No LinkedIn session found. Please log into LinkedIn in this browser first.');
      }
    }, 2500);
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
  };

  const handleTestConnection = () => {
    // Mock test connection
    alert('Connection test successful! Your LinkedIn session is active.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-black max-w-lg w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link to="/" className="absolute left-8 top-8 text-sm text-gray-600 hover:text-black">
              ← Back
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Connect Your LinkedIn Account</h1>
          <p className="text-gray-600">Securely connect using your browser cookies</p>
        </div>

        {/* Status Section */}
        <div className="mb-8">
          <div className={`flex items-center justify-center p-6 border-2 ${
            connectionStatus === 'connected' 
              ? 'border-emerald-500 bg-emerald-50' 
              : connectionStatus === 'error'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="text-center">
              <div className={`text-4xl mb-2 ${
                connectionStatus === 'connected' 
                  ? 'text-emerald-500' 
                  : connectionStatus === 'error'
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}>
                {connectionStatus === 'connected' ? '✓' : 
                 connectionStatus === 'error' ? '✗' : 
                 connectionStatus === 'connecting' ? '⟳' : '○'}
              </div>
              <div className={`font-medium ${
                connectionStatus === 'connected' 
                  ? 'text-emerald-700' 
                  : connectionStatus === 'error'
                  ? 'text-red-700'
                  : 'text-gray-700'
              }`}>
                {connectionStatus === 'connected' ? 'LinkedIn Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 connectionStatus === 'error' ? 'Connection Failed' :
                 'LinkedIn Not Connected'}
              </div>
              {connectionStatus === 'connected' && (
                <div className="text-sm text-emerald-600 mt-1">
                  Connected as: John Doe
                  <br />
                  Last validated: Just now
                </div>
              )}
              {connectionStatus === 'error' && (
                <div className="text-sm text-red-600 mt-1">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        {connectionStatus === 'disconnected' && (
          <div className="mb-8">
            <h3 className="font-medium text-black mb-3">To connect your LinkedIn account:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li>1. Make sure you're logged into LinkedIn in this browser</li>
              <li>2. Click the button below to authorize connection</li>
              <li>3. We'll securely read your session cookies</li>
              <li>4. Your password is never accessed or stored</li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {connectionStatus === 'disconnected' && (
            <button
              onClick={handleConnect}
              className="w-full px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            >
              Connect LinkedIn Account
            </button>
          )}

          {connectionStatus === 'connecting' && (
            <button
              disabled
              className="w-full px-6 py-3 bg-gray-400 text-white font-medium cursor-not-allowed"
            >
              <span className="inline-block animate-spin mr-2">⟳</span>
              Connecting...
            </button>
          )}

          {connectionStatus === 'connected' && (
            <div className="space-y-3">
              <button
                onClick={handleTestConnection}
                className="w-full px-6 py-2 border border-emerald-500 text-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                Test Connection
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full px-6 py-2 border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
              >
                Disconnect Account
              </button>
              <Link
                to="/"
                className="block w-full px-6 py-2 bg-emerald-500 text-white text-center hover:bg-emerald-600 transition-colors"
              >
                Continue
              </Link>
            </div>
          )}

          {connectionStatus === 'error' && (
            <button
              onClick={handleConnect}
              className="w-full px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200">
          <div className="flex items-start">
            <span className="text-gray-400 mr-2 mt-0.5">🔒</span>
            <div className="text-xs text-gray-600">
              <strong>Security Note:</strong> We only access your session cookies to automate actions on your behalf. 
              Your login credentials are never accessed or stored. Cookies are encrypted and stored securely.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInConnect;
