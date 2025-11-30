import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Phone, Mail, Clock } from 'lucide-react';

const Locations = () => {
  const [locations, setLocations] = useState([
    { 
      id: 1, 
      name: 'Bangkok Headquarters', 
      address: '123 Siam Square, Pathum Wan, Bangkok 10330', 
      phone: '02-123-4567', 
      email: 'bangkok@chaicharoen.com', 
      hours: 'Mon-Sun: 8:00 AM - 10:00 PM',
      status: 'Active',
      coordinates: { lat: 13.746548, lng: 100.532654 }
    },
    { 
      id: 2, 
      name: 'Chiang Mai Branch', 
      address: '456 Nimman Road, Suthep, Chiang Mai 50200', 
      phone: '053-123-456', 
      email: 'chiangmai@chaicharoen.com', 
      hours: 'Mon-Sun: 8:00 AM - 9:00 PM',
      status: 'Active',
      coordinates: { lat: 18.788049, lng: 98.953117 }
    },
    { 
      id: 3, 
      name: 'Phuket Outlet', 
      address: '789 Patong Beach, Kathu, Phuket 83150', 
      phone: '076-123-456', 
      email: 'phuket@chaicharoen.com', 
      hours: 'Mon-Sun: 9:00 AM - 11:00 PM',
      status: 'Active',
      coordinates: { lat: 7.888214, lng: 98.295849 }
    },
    { 
      id: 4, 
      name: 'Pattaya Location', 
      address: '321 Central Festival, Wongamat, Pattaya 20150', 
      phone: '038-123-456', 
      email: 'pattaya@chaicharoen.com', 
      hours: 'Mon-Sun: 10:00 AM - 10:00 PM',
      status: 'Inactive',
      coordinates: { lat: 12.923555, lng: 100.882796 }
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    hours: ''
  });

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (newLocation.name.trim()) {
      const location = {
        id: locations.length + 1,
        ...newLocation,
        status: 'Active',
        coordinates: { lat: 0, lng: 0 } // Default coordinates
      };
      setLocations([...locations, location]);
      setNewLocation({ name: '', address: '', phone: '', email: '', hours: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteLocation = (id) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600">Manage catering service locations</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </button>
      </div>

      {/* Add Location Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Location</h3>
          <form onSubmit={handleAddLocation}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={newLocation.phone}
                  onChange={(e) => setNewLocation({...newLocation, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newLocation.email}
                  onChange={(e) => setNewLocation({...newLocation, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                <input
                  type="text"
                  value={newLocation.hours}
                  onChange={(e) => setNewLocation({...newLocation, hours: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mon-Sun: 8:00 AM - 10:00 PM"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Location
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Locations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(location.status)}`}>
                    {location.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteLocation(location.id)}
                    className="p-1 hover:bg-gray-100 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{location.phone}</p>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{location.email}</p>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{location.hours}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;