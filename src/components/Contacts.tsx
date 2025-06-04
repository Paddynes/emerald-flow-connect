
import React, { useState } from 'react';

interface Contact {
  id: number;
  name: string;
  company: string;
  title: string;
  email: string;
  status: string;
  campaign: string;
  lastContact: string;
  selected?: boolean;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'TechCorp',
      title: 'VP Sales',
      email: 'sarah.johnson@techcorp.com',
      status: 'Connected',
      campaign: 'Q4 Sales Outreach',
      lastContact: '2024-01-15',
    },
    {
      id: 2,
      name: 'Mike Chen',
      company: 'StartupXYZ',
      title: 'Director of Marketing',
      email: 'mike.chen@startupxyz.com',
      status: 'Pending',
      campaign: 'Product Demo Follow-up',
      lastContact: '2024-01-14',
    },
    {
      id: 3,
      name: 'Emma Davis',
      company: 'InnovateLab',
      title: 'CEO',
      email: 'emma.davis@innovatelab.com',
      status: 'Replied',
      campaign: 'Conference Outreach',
      lastContact: '2024-01-13',
    },
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const selectedCount = contacts.filter(c => c.selected).length;

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setContacts(contacts.map(contact => ({ ...contact, selected: newSelectAll })));
  };

  const toggleContactSelection = (contactId: number) => {
    setContacts(contacts.map(contact =>
      contact.id === contactId ? { ...contact, selected: !contact.selected } : contact
    ));
  };

  const handleSort = (column: string) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
    
    const sortedContacts = [...contacts].sort((a, b) => {
      const aValue = a[column as keyof Contact];
      const bValue = b[column as keyof Contact];
      
      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setContacts(sortedContacts);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'text-emerald-500';
      case 'Replied':
        return 'text-emerald-500';
      case 'Pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Contacts</h1>
        <button className="px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors">
          Import CSV
        </button>
      </div>

      {selectedCount > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between">
          <span className="text-sm text-emerald-700">
            {selectedCount} contact{selectedCount > 1 ? 's' : ''} selected
          </span>
          <div className="space-x-2">
            <button className="text-sm text-emerald-600 hover:text-emerald-800">Add to Campaign</button>
            <button className="text-sm text-emerald-600 hover:text-emerald-800">Export</button>
            <button className="text-sm text-red-600 hover:text-red-800">Delete</button>
          </div>
        </div>
      )}

      {contacts.length > 0 ? (
        <div className="bg-white border border-black">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th
                  className="text-left p-4 font-semibold text-black cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <span className="ml-1 text-xs">
                      {sortColumn === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : '↑↓'}
                    </span>
                  </div>
                </th>
                <th
                  className="text-left p-4 font-semibold text-black cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('company')}
                >
                  <div className="flex items-center">
                    Company
                    <span className="ml-1 text-xs">
                      {sortColumn === 'company' ? (sortDirection === 'asc' ? '↑' : '↓') : '↑↓'}
                    </span>
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-black">Title</th>
                <th
                  className="text-left p-4 font-semibold text-black cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <span className="ml-1 text-xs">
                      {sortColumn === 'status' ? (sortDirection === 'asc' ? '↑' : '↓') : '↑↓'}
                    </span>
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-black">Campaign</th>
                <th
                  className="text-left p-4 font-semibold text-black cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('lastContact')}
                >
                  <div className="flex items-center">
                    Last Contact
                    <span className="ml-1 text-xs">
                      {sortColumn === 'lastContact' ? (sortDirection === 'asc' ? '↑' : '↓') : '↑↓'}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr
                  key={contact.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index !== contacts.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={contact.selected || false}
                      onChange={() => toggleContactSelection(contact.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-black">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                    </div>
                  </td>
                  <td className="p-4 text-black">{contact.company}</td>
                  <td className="p-4 text-gray-600">{contact.title}</td>
                  <td className="p-4">
                    <span className={`font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm bg-gray-100 px-2 py-1 text-gray-700">
                      {contact.campaign}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{contact.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border border-black">
          <p className="text-gray-600 mb-4">Import contacts to get started</p>
          <button className="px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors">
            Import CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default Contacts;
