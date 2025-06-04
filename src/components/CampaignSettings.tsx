
import React from 'react';

interface CampaignSettingsProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const CampaignSettings = ({ data, onUpdate }: CampaignSettingsProps) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    onUpdate({
      [parent]: {
        ...data[parent],
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Basic Settings */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Campaign Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 border border-black text-sm"
              placeholder="Enter campaign name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Description (Optional)</label>
            <textarea
              value={data.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-3 border border-black text-sm h-24"
              placeholder="Describe your campaign objectives"
            />
          </div>
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Schedule Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Start Campaign</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="schedule"
                  value="immediately"
                  checked={data.schedule === 'immediately'}
                  onChange={(e) => handleInputChange('schedule', e.target.value)}
                  className="mr-2"
                />
                Immediately
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="schedule"
                  value="scheduled"
                  checked={data.schedule === 'scheduled'}
                  onChange={(e) => handleInputChange('schedule', e.target.value)}
                  className="mr-2"
                />
                Scheduled
              </label>
            </div>
            {data.schedule === 'scheduled' && (
              <div className="mt-2">
                <input
                  type="datetime-local"
                  value={data.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className="p-2 border border-black"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Working Hours</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                <input
                  type="time"
                  value={data.workingHours.startTime}
                  onChange={(e) => handleNestedChange('workingHours', 'startTime', e.target.value)}
                  className="w-full p-2 border border-black"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Time</label>
                <input
                  type="time"
                  value={data.workingHours.endTime}
                  onChange={(e) => handleNestedChange('workingHours', 'endTime', e.target.value)}
                  className="w-full p-2 border border-black"
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <label key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.workingHours.days.includes(day)}
                    onChange={(e) => {
                      const newDays = e.target.checked
                        ? [...data.workingHours.days, day]
                        : data.workingHours.days.filter((d: string) => d !== day);
                      handleNestedChange('workingHours', 'days', newDays);
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm capitalize">{day.slice(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Timezone</label>
            <select
              value={data.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full p-2 border border-black"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">GMT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Rate Limits</h3>
        <div className="bg-yellow-50 border border-yellow-200 p-3 mb-4">
          <p className="text-sm text-yellow-800">
            ⚠️ LinkedIn may restrict accounts for excessive activity. Use conservative limits.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Connection Requests/Day</label>
            <input
              type="number"
              value={data.rateLimits.connectionsPerDay}
              onChange={(e) => handleNestedChange('rateLimits', 'connectionsPerDay', parseInt(e.target.value))}
              className="w-full p-2 border border-black"
              min="1"
              max="50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Messages/Day</label>
            <input
              type="number"
              value={data.rateLimits.messagesPerDay}
              onChange={(e) => handleNestedChange('rateLimits', 'messagesPerDay', parseInt(e.target.value))}
              className="w-full p-2 border border-black"
              min="1"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Total Actions/Day</label>
            <input
              type="number"
              value={data.rateLimits.totalActionsPerDay}
              onChange={(e) => handleNestedChange('rateLimits', 'totalActionsPerDay', parseInt(e.target.value))}
              className="w-full p-2 border border-black"
              min="1"
              max="200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSettings;
