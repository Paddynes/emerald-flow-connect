import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

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
  customFields?: Record<string, any>;
}

interface Column {
  key: string;
  label: string;
  visible: boolean;
  width: number;
  sortable: boolean;
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
      customFields: {
        industry: 'Technology',
        employees: '500-1000',
        revenue: '$50M+'
      }
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
      customFields: {
        industry: 'SaaS',
        employees: '50-100',
        revenue: '$5M+'
      }
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
      customFields: {
        industry: 'Healthcare',
        employees: '100-500',
        revenue: '$20M+'
      }
    },
  ]);

  const [columns, setColumns] = useState<Column[]>([
    { key: 'select', label: '', visible: true, width: 50, sortable: false },
    { key: 'name', label: 'Name', visible: true, width: 200, sortable: true },
    { key: 'company', label: 'Company', visible: true, width: 150, sortable: true },
    { key: 'title', label: 'Title', visible: true, width: 150, sortable: false },
    { key: 'status', label: 'Status', visible: true, width: 100, sortable: true },
    { key: 'campaign', label: 'Campaign', visible: true, width: 150, sortable: false },
    { key: 'lastContact', label: 'Last Contact', visible: true, width: 120, sortable: true },
    { key: 'industry', label: 'Industry', visible: false, width: 120, sortable: true },
    { key: 'employees', label: 'Employees', visible: false, width: 100, sortable: true },
    { key: 'revenue', label: 'Revenue', visible: false, width: 100, sortable: true },
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const selectedCount = contacts.filter(c => c.selected).length;
  const visibleColumns = columns.filter(col => col.visible);

  const addNewColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: Column = {
        key: newColumnName.toLowerCase().replace(/\s+/g, '_'),
        label: newColumnName,
        visible: true,
        width: 120,
        sortable: true
      };
      setColumns([...columns, newColumn]);
      setNewColumnName('');
      setShowAddColumn(false);
    }
  };

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

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    const direction = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnKey);
    setSortDirection(direction);
    
    const sortedContacts = [...contacts].sort((a, b) => {
      let aValue, bValue;
      
      if (columnKey in a) {
        aValue = a[columnKey as keyof Contact];
        bValue = b[columnKey as keyof Contact];
      } else {
        aValue = a.customFields?.[columnKey] || '';
        bValue = b.customFields?.[columnKey] || '';
      }
      
      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setContacts(sortedContacts);
  };

  const toggleColumnVisibility = (columnKey: string) => {
    setColumns(columns.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
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

  const getCellValue = (contact: Contact, columnKey: string) => {
    if (columnKey in contact) {
      return contact[columnKey as keyof Contact];
    }
    return contact.customFields?.[columnKey] || '';
  };

  const renderCell = (contact: Contact, column: Column) => {
    const value = getCellValue(contact, column.key);

    switch (column.key) {
      case 'select':
        return (
          <input
            type="checkbox"
            checked={contact.selected || false}
            onChange={() => toggleContactSelection(contact.id)}
            className="w-4 h-4"
          />
        );
      case 'name':
        return (
          <div>
            <div className="font-medium text-black">{contact.name}</div>
            <div className="text-sm text-gray-500">{contact.email}</div>
          </div>
        );
      case 'status':
        return (
          <span className={`font-medium ${getStatusColor(value as string)}`}>
            {value}
          </span>
        );
      case 'campaign':
        return (
          <span className="text-sm bg-gray-100 px-2 py-1 text-gray-700">
            {value}
          </span>
        );
      default:
        return <span className="text-black">{value}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Contacts</h1>
        <div className="flex space-x-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-black text-black hover:bg-gray-50">
                Customize Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 border-black">
              <div className="space-y-2">
                <h4 className="font-medium text-black">Show/Hide Columns</h4>
                {columns.filter(col => col.key !== 'select').map((column) => (
                  <label key={column.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={column.visible}
                      onChange={() => toggleColumnVisibility(column.key)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{column.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover open={showAddColumn} onOpenChange={setShowAddColumn}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-black text-black hover:bg-gray-50">
                <Plus className="w-4 h-4 mr-2" />
                Add Column
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 border-black">
              <div className="space-y-4">
                <h4 className="font-medium text-black">Add New Column</h4>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Column Name</label>
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="e.g., Phone Number"
                    className="w-full p-2 border border-black text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addNewColumn()}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={addNewColumn}
                    disabled={!newColumnName.trim()}
                    className="bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddColumn(false);
                      setNewColumnName('');
                    }}
                    variant="outline"
                    className="border-black text-black hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button className="bg-emerald-500 text-white hover:bg-emerald-600">
            Import CSV
          </Button>
        </div>
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
        <div className="bg-white border border-black overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black">
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`text-left p-4 font-semibold text-black ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    {column.key === 'select' ? (
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="w-4 h-4"
                      />
                    ) : (
                      <div className="flex items-center">
                        {column.label}
                        {column.sortable && (
                          <span className="ml-1 text-xs">
                            {sortColumn === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↑↓'}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
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
                  {visibleColumns.map((column) => (
                    <td key={column.key} className="p-4">
                      {renderCell(contact, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border border-black">
          <p className="text-gray-600 mb-4">Import contacts to get started</p>
          <Button className="bg-emerald-500 text-white hover:bg-emerald-600">
            Import CSV
          </Button>
        </div>
      )}
    </div>
  );
};

export default Contacts;
