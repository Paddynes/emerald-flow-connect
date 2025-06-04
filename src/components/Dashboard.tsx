
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const campaigns = [
    {
      id: 1,
      name: 'LinkedIn Sales Outreach Q4',
      status: 'active',
      contactsRemaining: 247,
      progress: 68,
    },
    {
      id: 2,
      name: 'Product Demo Follow-up',
      status: 'active',
      contactsRemaining: 89,
      progress: 92,
    },
    {
      id: 3,
      name: 'Conference Attendee Outreach',
      status: 'paused',
      contactsRemaining: 156,
      progress: 34,
    },
  ];

  const performanceData = [
    { action: 'Connections', sent: 847, successful: 234, rate: 27.6 },
    { action: 'Messages', sent: 1241, successful: 678, rate: 54.6 },
    { action: 'Follow-ups', sent: 423, successful: 189, rate: 44.7 },
  ];

  return (
    <div className="space-y-8">
      {/* Active Campaigns Overview */}
      <section>
        <h2 className="text-2xl font-bold text-black mb-6">Active Campaigns</h2>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                to={`/campaigns/${campaign.id}`}
                className="block p-6 bg-white border border-black hover:border-2 hover:border-black transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-black">{campaign.name}</h3>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      campaign.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {campaign.contactsRemaining} contacts remaining
                </p>
                <div className="w-full bg-gray-200 h-1">
                  <div
                    className="bg-emerald-500 h-1 transition-all duration-300"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{campaign.progress}% complete</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-black">
            <p className="text-gray-600 mb-4">No active campaigns. Create your first campaign →</p>
            <Link
              to="/campaigns/new"
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Create Campaign
            </Link>
          </div>
        )}
      </section>

      {/* Today's Performance */}
      <section>
        <h2 className="text-2xl font-bold text-black mb-6">Today's Performance</h2>
        <div className="bg-white border border-black">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left p-4 font-semibold text-black">Action Type</th>
                <th className="text-left p-4 font-semibold text-black">Sent</th>
                <th className="text-left p-4 font-semibold text-black">Successful</th>
                <th className="text-left p-4 font-semibold text-black">Rate %</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((row, index) => (
                <tr key={row.action} className={index !== performanceData.length - 1 ? 'border-b border-black' : ''}>
                  <td className="p-4 font-medium text-black">{row.action}</td>
                  <td className="p-4 text-2xl font-bold text-black">{row.sent.toLocaleString()}</td>
                  <td className="p-4 text-2xl font-bold text-black">{row.successful.toLocaleString()}</td>
                  <td className="p-4 text-2xl font-bold text-emerald-500">{row.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Quick Actions</h2>
            <Link
              to="/campaigns/new"
              className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            >
              Create Campaign
            </Link>
          </div>
          <div className="w-1/3">
            <h3 className="font-semibold text-black mb-4">Recent Campaigns</h3>
            <div className="space-y-2">
              {campaigns.slice(0, 3).map((campaign) => (
                <Link
                  key={campaign.id}
                  to={`/campaigns/${campaign.id}`}
                  className="block text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {campaign.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
