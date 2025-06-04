
import React from 'react';
import { Link } from 'react-router-dom';

const Campaigns = () => {
  const campaigns = [
    {
      id: 1,
      name: 'LinkedIn Sales Outreach Q4',
      status: 'active',
      contacts: 247,
      sent: 523,
      replies: 89,
      connections: 156,
      created: '2024-01-15',
    },
    {
      id: 2,
      name: 'Product Demo Follow-up',
      status: 'active',
      contacts: 89,
      sent: 234,
      replies: 67,
      connections: 45,
      created: '2024-01-20',
    },
    {
      id: 3,
      name: 'Conference Attendee Outreach',
      status: 'paused',
      contacts: 156,
      sent: 78,
      replies: 12,
      connections: 34,
      created: '2024-01-10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Campaigns</h1>
        <Link
          to="/campaigns/new"
          className="px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
        >
          Create Campaign
        </Link>
      </div>

      {campaigns.length > 0 ? (
        <div className="bg-white border border-black">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left p-4 font-semibold text-black">Campaign Name</th>
                <th className="text-left p-4 font-semibold text-black">Status</th>
                <th className="text-left p-4 font-semibold text-black">Contacts</th>
                <th className="text-left p-4 font-semibold text-black">Sent</th>
                <th className="text-left p-4 font-semibold text-black">Replies</th>
                <th className="text-left p-4 font-semibold text-black">Connections</th>
                <th className="text-left p-4 font-semibold text-black">Created</th>
                <th className="text-left p-4 font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr
                  key={campaign.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index !== campaigns.length - 1 ? 'border-b border-black' : ''
                  }`}
                >
                  <td className="p-4">
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="font-medium text-black hover:text-emerald-500 transition-colors"
                    >
                      {campaign.name}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          campaign.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className={campaign.status === 'active' ? 'text-emerald-500' : 'text-gray-500'}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-black">{campaign.contacts}</td>
                  <td className="p-4 text-black">{campaign.sent}</td>
                  <td className="p-4 text-black">{campaign.replies}</td>
                  <td className="p-4 text-black">{campaign.connections}</td>
                  <td className="p-4 text-gray-500">{campaign.created}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        Edit
                      </Link>
                      <button className="text-sm text-gray-600 hover:text-black transition-colors">
                        Duplicate
                      </button>
                      <button className="text-sm text-gray-600 hover:text-red-500 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border border-black">
          <p className="text-gray-600 mb-4">No campaigns yet. Create your first campaign to get started.</p>
          <Link
            to="/campaigns/new"
            className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
          >
            Create Campaign
          </Link>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
