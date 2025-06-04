
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampaignSettings from './CampaignSettings';
import SelectContacts from './SelectContacts';
import PreviewMessages from './PreviewMessages';
import ReviewLaunch from './ReviewLaunch';

const CampaignSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: 'Untitled Campaign',
    description: '',
    schedule: 'immediately',
    scheduledDate: '',
    workingHours: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00'
    },
    timezone: 'UTC',
    rateLimits: {
      connectionsPerDay: 20,
      messagesPerDay: 50,
      totalActionsPerDay: 100
    },
    contacts: [],
    linkedinConnected: true
  });

  const steps = [
    { number: 1, title: 'Campaign Settings' },
    { number: 2, title: 'Select Contacts' },
    { number: 3, title: 'Preview Messages' },
    { number: 4, title: 'Review & Launch' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Launch campaign
      navigate('/');
      // Show success toast (would be implemented with toast system)
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/campaigns/1');
    }
  };

  const updateCampaignData = (updates: any) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CampaignSettings data={campaignData} onUpdate={updateCampaignData} />;
      case 2:
        return <SelectContacts data={campaignData} onUpdate={updateCampaignData} />;
      case 3:
        return <PreviewMessages data={campaignData} onUpdate={updateCampaignData} />;
      case 4:
        return <ReviewLaunch data={campaignData} onUpdate={updateCampaignData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/campaigns/1" className="text-sm text-gray-600 hover:text-black">
            ← Back to Campaign Builder
          </Link>
          <h1 className="text-xl font-semibold text-black">
            {steps[currentStep - 1].title}
          </h1>
          <div className="text-sm text-gray-500">
            Step {currentStep} of 4
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 flex space-x-2">
          {steps.map((step) => (
            <div key={step.number} className="flex-1">
              <div className={`h-1 ${
                step.number <= currentStep ? 'bg-emerald-500' : 'bg-gray-200'
              }`} />
              <div className="mt-2 text-xs text-gray-500">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        {renderStep()}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-black px-6 py-4 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 border border-black text-black hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
        >
          {currentStep === 4 ? 'Launch Campaign' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CampaignSetup;
