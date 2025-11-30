import React, { useState } from 'react';
import { ChefHat, Plus, Edit, Trash2, Phone, Mail, Calendar, Search } from 'lucide-react';

const Chefs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample chef data
  const chefs = [
    { 
      id: 1, 
      name: 'Chef Somchai', 
      position: 'Head Chef', 
      specialty: 'Traditional Thai Cuisine', 
      experience: '15 years', 
      phone: '081-111-2222', 
      email: 'somchai@chaicharoen.com', 
      status: 'Active',
      image: 'https://placehold.co/80x80'
    },
    { 
      id: 2, 
      name: 'Chef Niran', 
      position: 'Sous Chef', 
      specialty: 'Seafood Dishes', 
      experience: '8 years', 
      phone: '082-222-3333', 
      email: 'niran@chaicharoen.com', 
      status: 'Active',
      image: 'https://placehold.co/80x80'
    },
    { 
      id: 3, 
      name: 'Chef Kanya', 
      position: 'Pastry Chef', 
      specialty: 'Desserts & Baking', 
      experience: '10 years', 
      phone: '083-333-4444', 
      email: 'kanya@chaicharoen.com', 
      status: 'Active',
      image: 'https://placehold.co/80x80'
    },
    { 
      id: 4, 
      name: 'Chef Arthit', 
      position: 'Line Chef', 
      specialty: 'Vegetarian Dishes', 
      experience: '5 years', 
      phone: '084-444-5555', 
      email: 'arthit@chaicharoen.com', 
      status: 'Active',
      image: 'https://placehold.co/80x80'
    },
    { 
      id: 5, 
      name: 'Chef Patcharee', 
      position: 'Junior Chef', 
      specialty: 'Appetizers', 
      experience: '3 years', 
      phone: '085-555-6666', 
      email: 'patcharee@chaicharoen.com', 
      status: 'Inactive',
      image: 'https://placehold.co/80x80'
    }
  ];

  const filteredChefs = chefs.filter(chef => 
    chef.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    chef.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chef.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Chefs & Staff</h1>
          <p className="text-gray-600">Manage kitchen staff and chef profiles</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <ChefHat className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <ChefHat className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-semibold text-gray-900">21</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <ChefHat className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chefs</p>
              <p className="text-2xl font-semibold text-gray-900">15</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <ChefHat className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Experience</p>
              <p className="text-2xl font-semibold text-gray-900">7.2 yrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search staff by name, position, or specialty..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chefs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Staff Directory</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredChefs.map((chef) => (
                <tr key={chef.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={chef.image} 
                        alt={chef.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{chef.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{chef.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{chef.specialty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{chef.experience}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{chef.phone}</div>
                    <div className="text-sm text-gray-600">{chef.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(chef.status)}`}>
                      {chef.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Chefs;