import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaintenanceLog = ({ carId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLog, setNewLog] = useState({
    type: 'service',
    description: '',
    cost: '',
    serviceDate: '',
    nextServiceDate: '',
    serviceCenter: '',
    odometer: ''
  });

  useEffect(() => {
    fetchMaintenanceHistory();
  }, [carId]);

  const fetchMaintenanceHistory = async () => {
    try {
      const response = await axios.get(`/api/cars/${carId}/maintenance`);
      setLogs(response.data.car.maintenanceLog || []);
    } catch (error) {
      console.error('Error fetching maintenance history');
    }
  };

  const addMaintenanceLog = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/cars/${carId}/maintenance`, newLog);
      alert('Maintenance log added successfully!');
      setShowAddForm(false);
      setNewLog({
        type: 'service',
        description: '',
        cost: '',
        serviceDate: '',
        nextServiceDate: '',
        serviceCenter: '',
        odometer: ''
      });
      fetchMaintenanceHistory();
    } catch (error) {
      alert('Error adding maintenance log');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'service': return '🔧';
      case 'tyre_change': return '🛞';
      case 'oil_change': return '🛢️';
      case 'repair': return '⚙️';
      default: return '📝';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Maintenance & Service Log</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Entry
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Add Maintenance Entry</h3>
            <form onSubmit={addMaintenanceLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newLog.type}
                    onChange={(e) => setNewLog(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="service">Regular Service</option>
                    <option value="tyre_change">Tyre Change</option>
                    <option value="oil_change">Oil Change</option>
                    <option value="repair">Repair</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    value={newLog.cost}
                    onChange={(e) => setNewLog(prev => ({ ...prev, cost: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newLog.description}
                  onChange={(e) => setNewLog(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                  placeholder="Service details..."
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Service Date</label>
                  <input
                    type="date"
                    value={newLog.serviceDate}
                    onChange={(e) => setNewLog(prev => ({ ...prev, serviceDate: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Next Service Date</label>
                  <input
                    type="date"
                    value={newLog.nextServiceDate}
                    onChange={(e) => setNewLog(prev => ({ ...prev, nextServiceDate: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Odometer (KM)</label>
                  <input
                    type="number"
                    value={newLog.odometer}
                    onChange={(e) => setNewLog(prev => ({ ...prev, odometer: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Service Center</label>
                <input
                  type="text"
                  value={newLog.serviceCenter}
                  onChange={(e) => setNewLog(prev => ({ ...prev, serviceCenter: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="ABC Motors"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No maintenance records found</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(log.type)}</span>
                    <div>
                      <h4 className="font-semibold capitalize">{log.type.replace('_', ' ')}</h4>
                      <p className="text-sm text-gray-600">{log.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{log.cost}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(log.serviceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mt-3">
                  {log.serviceCenter && (
                    <div>
                      <span className="font-medium">Service Center:</span>
                      <p>{log.serviceCenter}</p>
                    </div>
                  )}
                  {log.odometer && (
                    <div>
                      <span className="font-medium">Odometer:</span>
                      <p>{log.odometer} KM</p>
                    </div>
                  )}
                  {log.nextServiceDate && (
                    <div>
                      <span className="font-medium">Next Service:</span>
                      <p>{new Date(log.nextServiceDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceLog;