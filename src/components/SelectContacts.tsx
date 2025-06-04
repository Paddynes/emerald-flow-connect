
import React, { useState } from 'react';

interface SelectContactsProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const SelectContacts = ({ data, onUpdate }: SelectContactsProps) => {
  const [importMethod, setImportMethod] = useState<'new' | 'existing'>('existing');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  const existingContacts = [
    { id: 1, name: 'Sarah Johnson', company: 'TechCorp', title: 'VP Sales', status: 'Active' },
    { id: 2, name: 'Mike Chen', company: 'StartupXYZ', title: 'Director Marketing', status: 'Active' },
    { id: 3, name: 'Emma Davis', company: 'InnovateLab', title: 'CEO', status: 'Active' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // Mock CSV preview
      setCsvPreview([
        { firstName: 'John', lastName: 'Doe', company: 'Tech Inc', title: 'CEO' },
        { firstName: 'Jane', lastName: 'Smith', company: 'Design Co', title: 'Designer' },
        { firstName: 'Bob', lastName: 'Wilson', company: 'Sales Corp', title: 'Manager' },
      ]);
    }
  };

  const toggleContactSelection = (contactId: number) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const selectAllContacts = () => {
    setSelectedContacts(existingContacts.map(c => c.id));
  };

  const deselectAllContacts = () => {
    setSelectedContacts([]);
  };

  return (
    <div className="space-y-6">
      {/* Import Method Selection */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Choose Import Method</h3>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="importMethod"
              value="existing"
              checked={importMethod === 'existing'}
              onChange={(e) => setImportMethod(e.target.value as 'existing')}
              className="mr-2"
            />
            Select Existing Contacts
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="importMethod"
              value="new"
              checked={importMethod === 'new'}
              onChange={(e) => setImportMethod(e.target.value as 'new')}
              className="mr-2"
            />
            Import New CSV
          </label>
        </div>
      </div>

      {importMethod === 'new' && (
        <div className="bg-white border border-black p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Import CSV File</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="text-gray-500">
                <p className="text-lg mb-2">Drop CSV file here or click to browse</p>
                <p className="text-sm">Supported format: .csv</p>
              </div>
            </label>
          </div>

          {csvPreview.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-black mb-2">Preview (First 3 rows)</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-black">
                  <thead>
                    <tr className="border-b border-black">
                      {Object.keys(csvPreview[0]).map(header => (
                        <th key={header} className="p-2 text-left font-medium border-r border-black last:border-r-0">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.map((row, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="p-2 border-r border-gray-200 last:border-r-0">
                            {value as string}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200">
                <p className="text-sm text-emerald-700">
                  ✓ {csvPreview.length} contacts ready to import
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {importMethod === 'existing' && (
        <div className="bg-white border border-black p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Select Existing Contacts</h3>
            <div className="flex space-x-2">
              <button
                onClick={selectAllContacts}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Select All
              </button>
              <button
                onClick={deselectAllContacts}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {existingContacts.map(contact => (
              <div
                key={contact.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  selectedContacts.includes(contact.id)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleContactSelection(contact.id)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => toggleContactSelection(contact.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-black">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.title} at {contact.company}</div>
                  </div>
                  <div className="text-sm text-emerald-500">{contact.status}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedContacts.length > 0 && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200">
              <p className="text-sm text-emerald-700">
                ✓ {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectContacts;
