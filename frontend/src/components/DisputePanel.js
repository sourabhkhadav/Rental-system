import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisputePanel = ({ onClose }) => {
  const [disputes, setDisputes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [newDispute, setNewDispute] = useState({
    bookingId: '',
    type: 'damage',
    title: '',
    description: '',
    claimedAmount: ''
  });

  useEffect(() => {
    fetchDisputes();
    fetchBookings();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await axios.get('/api/cars/my-disputes');
      setDisputes(response.data.disputes);
    } catch (error) {
      console.error('Error fetching disputes');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/owner');
      setBookings(response.data.bookings.filter(b => 
        ['completed', 'ongoing'].includes(b.status)
      ));
    } catch (error) {
      console.error('Error fetching bookings');
    }
  };

  const createDispute = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/cars/disputes', newDispute);
      alert('Dispute created successfully!');
      setShowCreateForm(false);
      setNewDispute({
        bookingId: '',
        type: 'damage',
        title: '',
        description: '',
        claimedAmount: ''
      });
      fetchDisputes();
    } catch (error) {
      alert('Error creating dispute');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'damage': return '💥';
      case 'late_return': return '⏰';
      case 'payment_issue': return '💳';
      case 'no_show': return '❌';
      case 'cleanliness': return '🧽';
      default: return '❓';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Dispute Support Panel</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Raise Dispute
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Create New Dispute</h3>
            <form onSubmit={createDispute} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Booking</label>
                  <select
                    value={newDispute.bookingId}
                    onChange={(e) => setNewDispute(prev => ({ ...prev, bookingId: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Booking</option>
                    {bookings.map(booking => (
                      <option key={booking._id} value={booking._id}>
                        {booking.car.name} - {new Date(booking.startDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dispute Type</label>
                  <select
                    value={newDispute.type}
                    onChange={(e) => setNewDispute(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="damage">Damage</option>
                    <option value="late_return">Late Return</option>
                    <option value="payment_issue">Payment Issue</option>
                    <option value="no_show">No Show</option>
                    <option value="cleanliness">Cleanliness</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newDispute.title}
                  onChange={(e) => setNewDispute(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newDispute.description}
                  onChange={(e) => setNewDispute(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                  placeholder="Detailed description of the issue..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Claimed Amount (₹)</label>
                <input
                  type="number"
                  value={newDispute.claimedAmount}
                  onChange={(e) => setNewDispute(prev => ({ ...prev, claimedAmount: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Create Dispute
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {disputes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No disputes found</p>
          ) : (
            disputes.map((dispute) => (
              <div key={dispute._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(dispute.type)}</span>
                    <div>
                      <h4 className="font-semibold">{dispute.title}</h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {dispute.type.replace('_', ' ')} • {dispute.car.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(dispute.status)}`}>
                      {dispute.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{dispute.description}</p>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Against:</span>
                    <p>{dispute.againstUser.name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Booking Date:</span>
                    <p>{new Date(dispute.booking.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Claimed Amount:</span>
                    <p className="text-red-600 font-semibold">₹{dispute.claimedAmount}</p>
                  </div>
                </div>

                {dispute.resolution && (
                  <div className="mt-3 p-3 bg-green-50 rounded">
                    <h5 className="font-medium text-green-800">Resolution:</h5>
                    <p className="text-green-700">{dispute.resolution}</p>
                  </div>
                )}
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

export default DisputePanel;