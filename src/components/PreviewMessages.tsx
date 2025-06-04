
import React, { useState } from 'react';

interface PreviewMessagesProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const PreviewMessages = ({ data, onUpdate }: PreviewMessagesProps) => {
  const [selectedSample, setSelectedSample] = useState(0);

  const sampleContacts = [
    { firstName: 'Sarah', lastName: 'Johnson', company: 'TechCorp', title: 'VP Sales' },
    { firstName: 'Mike', lastName: 'Chen', company: 'StartupXYZ', title: 'Director' },
    { firstName: 'Emma', lastName: 'Davis', company: 'InnovateLab', title: 'CEO' },
  ];

  const messageModules = [
    {
      type: 'connection',
      name: 'Connection Request',
      template: 'Hi {{firstName}}, I noticed you\'re the {{title}} at {{company}}. I\'d love to connect and share some insights about outreach automation.'
    },
    {
      type: 'message',
      name: 'Follow-up Message',
      template: 'Thanks for connecting, {{firstName}}! I saw your work at {{company}} and thought you might be interested in our automation platform.'
    }
  ];

  const replaceVariables = (template: string, contact: any) => {
    return template
      .replace(/{{firstName}}/g, contact.firstName)
      .replace(/{{lastName}}/g, contact.lastName)
      .replace(/{{company}}/g, contact.company)
      .replace(/{{title}}/g, contact.title);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Message Preview</h3>
        <p className="text-gray-600 mb-6">
          Review how your messages will appear to different contacts. Variables are automatically replaced with contact data.
        </p>

        {/* Sample Contact Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">Preview with contact:</label>
          <div className="flex space-x-2">
            {sampleContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => setSelectedSample(index)}
                className={`px-4 py-2 border transition-colors ${
                  selectedSample === index
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-black text-black hover:bg-gray-50'
                }`}
              >
                {contact.firstName}
              </button>
            ))}
          </div>
        </div>

        {/* Message Previews */}
        <div className="space-y-6">
          {messageModules.map((module, index) => (
            <div key={index} className="border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-black">{module.name}</h4>
                <button className="text-sm text-emerald-600 hover:text-emerald-700">
                  Edit Message
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 border border-gray-200">
                <div className="text-sm text-gray-500 mb-2">
                  To: {sampleContacts[selectedSample].firstName} {sampleContacts[selectedSample].lastName}
                </div>
                <div className="text-black">
                  {replaceVariables(module.template, sampleContacts[selectedSample])}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Variables Guide */}
        <div className="mt-6 bg-blue-50 border border-blue-200 p-4">
          <h4 className="font-medium text-black mb-2">Available Variables</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><code>{{firstName}}</code> - Contact's first name</div>
            <div><code>{{lastName}}</code> - Contact's last name</div>
            <div><code>{{company}}</code> - Company name</div>
            <div><code>{{title}}</code> - Job title</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMessages;
