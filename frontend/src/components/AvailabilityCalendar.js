import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AvailabilityCalendar = ({ carId, onClose }) => {
  const [calendar, setCalendar] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [blockReason, setBlockReason] = useState('');

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const toggleDateSelection = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDates(prev => 
      prev.includes(dateStr) 
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const blockSelectedDates = async () => {
    if (selectedDates.length === 0) return;
    
    try {
      const dates = selectedDates.map(date => ({
        date,
        status: 'blocked',
        reason: blockReason || 'Owner blocked'
      }));

      await axios.put(`/api/cars/${carId}/availability`, { dates });
      alert('Dates blocked successfully!');
      setSelectedDates([]);
      setBlockReason('');
    } catch (error) {
      alert('Error blocking dates');
    }
  };

  const getDateStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const calEntry = calendar.find(c => c.date.split('T')[0] === dateStr);
    return calEntry?.status || 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100';
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Availability Calendar</h2>
        
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="px-3 py-1 border rounded"
          >
            ← Previous
          </button>
          <h3 className="text-lg font-semibold">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="px-3 py-1 border rounded"
          >
            Next →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold p-2">{day}</div>
          ))}
          
          {days.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const status = getDateStatus(date);
            const isSelected = selectedDates.includes(dateStr);
            
            return (
              <div
                key={dateStr}
                onClick={() => status === 'available' && toggleDateSelection(date)}
                className={`
                  p-2 text-center cursor-pointer border rounded
                  ${getStatusColor(status)}
                  ${isSelected ? 'ring-2 ring-blue-500' : ''}
                  ${status !== 'available' ? 'cursor-not-allowed opacity-60' : 'hover:bg-opacity-80'}
                `}
              >
                <div className="text-sm">{date.getDate()}</div>
                <div className="text-xs">{status}</div>
              </div>
            );
          })}
        </div>

        {selectedDates.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Block Selected Dates ({selectedDates.length})</h4>
            <input
              type="text"
              placeholder="Reason for blocking (optional)"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <button
              onClick={blockSelectedDates}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Block Dates
            </button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-sm">
            <span className="flex items-center"><div className="w-3 h-3 bg-green-100 rounded mr-1"></div>Available</span>
            <span className="flex items-center"><div className="w-3 h-3 bg-red-100 rounded mr-1"></div>Blocked</span>
            <span className="flex items-center"><div className="w-3 h-3 bg-blue-100 rounded mr-1"></div>Booked</span>
            <span className="flex items-center"><div className="w-3 h-3 bg-yellow-100 rounded mr-1"></div>Maintenance</span>
          </div>
          
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

export default AvailabilityCalendar;