
import React, { useState } from 'react';

interface Message {
  id: number;
  contactName: string;
  contactTitle: string;
  company: string;
  message: string;
  time: string;
  campaign: string;
  isRead: boolean;
  avatar: string;
}

const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState('all');

  const messages: Message[] = [
    {
      id: 1,
      contactName: 'Sarah Johnson',
      contactTitle: 'VP Sales',
      company: 'TechCorp',
      message: 'Thanks for reaching out! I\'d be interested in learning more about your solution.',
      time: '2h ago',
      campaign: 'Q4 Sales Outreach',
      isRead: false,
      avatar: 'SJ',
    },
    {
      id: 2,
      contactName: 'Mike Chen',
      contactTitle: 'Director of Marketing',
      company: 'StartupXYZ',
      message: 'Hi there! Yes, let\'s schedule a call for next week.',
      time: '4h ago',
      campaign: 'Product Demo Follow-up',
      isRead: true,
      avatar: 'MC',
    },
    {
      id: 3,
      contactName: 'Emma Davis',
      contactTitle: 'CEO',
      company: 'InnovateLab',
      message: 'Interesting proposition. Can you send me more details?',
      time: '1d ago',
      campaign: 'Conference Outreach',
      isRead: false,
      avatar: 'ED',
    },
  ];

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'starred') return false; // No starred messages in this example
    return true;
  });

  return (
    <div className="flex h-screen bg-white">
      {/* Message List */}
      <div className="w-1/2 border-r border-black">
        <div className="border-b border-black p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-black">Inbox</h1>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-black text-sm"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="starred">Starred</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full p-2 border border-black text-sm"
          />
        </div>

        <div className="overflow-y-auto">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-gray-100' : ''
                } ${!message.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${!message.isRead ? 'font-semibold' : 'font-medium'} text-black`}>
                        {message.contactName}
                      </p>
                      <p className="text-xs text-gray-500">{message.time}</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{message.contactTitle} at {message.company}</p>
                    <p className="text-sm text-gray-600 truncate">{message.message}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs">
                      {message.campaign}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No messages yet. Start a campaign to begin outreach</p>
            </div>
          )}
        </div>
      </div>

      {/* Conversation View */}
      <div className="w-1/2 flex flex-col">
        {selectedMessage ? (
          <>
            <div className="border-b border-black p-4">
              <h2 className="font-semibold text-black">{selectedMessage.contactName}</h2>
              <p className="text-sm text-gray-500">{selectedMessage.contactTitle} at {selectedMessage.company}</p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-xs bg-emerald-500 text-white p-3 text-sm">
                    Hi {selectedMessage.contactName}, I noticed your work at {selectedMessage.company} and thought you might be interested in our solution...
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-xs bg-gray-100 text-black p-3 text-sm">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-black p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  className="flex-1 p-2 border border-black text-sm"
                />
                <button className="px-4 py-2 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a message to view conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
