import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DynamicPricing = ({ carId, onClose }) => {
  const [pricing, setPricing] = useState({
    enabled: false,
    weekendPrice: '',
    weekdayPrice: '',
    seasonalRates: [],
    customDates: []
  });

  const addSeasonalRate = () => {
    setPricing(prev => ({
      ...prev,
      seasonalRates: [...prev.seasonalRates, { name: '', startDate: '', endDate: '', pricePerDay: '' }]
    }));
  };

  const updateSeasonalRate = (index, field, value) => {
    setPricing(prev => ({
      ...prev,
      seasonalRates: prev.seasonalRates.map((rate, i) => 
        i === index ? { ...rate, [field]: value } : rate
      )
    }));
  };

  const savePricing = async () => {
    try {
      await axios.put(`/api/cars/${carId}/dynamic-pricing`, pricing);
      alert('Dynamic pricing updated successfully!');
      onClose();
    } catch (error) {
      alert('Error updating pricing');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Dynamic Pricing Settings</h2>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={pricing.enabled}
              onChange={(e) => setPricing(prev => ({ ...prev, enabled: e.target.checked }))}
              className="mr-2"
            />
            Enable Dynamic Pricing
          </label>
        </div>

        {pricing.enabled && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Weekday Price (₹/day)</label>
                <input
                  type="number"
                  value={pricing.weekdayPrice}
                  onChange={(e) => setPricing(prev => ({ ...prev, weekdayPrice: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="1500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weekend Price (₹/day)</label>
                <input
                  type="number"
                  value={pricing.weekendPrice}
                  onChange={(e) => setPricing(prev => ({ ...prev, weekendPrice: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="2000"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Seasonal Rates</h3>
                <button
                  onClick={addSeasonalRate}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Add Season
                </button>
              </div>
              
              {pricing.seasonalRates.map((rate, index) => (
                <div key={index} className="border rounded p-3 mb-3">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input
                      type="text"
                      placeholder="Season name (e.g., Summer)"
                      value={rate.name}
                      onChange={(e) => updateSeasonalRate(index, 'name', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="number"
                      placeholder="Price per day"
                      value={rate.pricePerDay}
                      onChange={(e) => updateSeasonalRate(index, 'pricePerDay', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={rate.startDate}
                      onChange={(e) => updateSeasonalRate(index, 'startDate', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="date"
                      value={rate.endDate}
                      onChange={(e) => updateSeasonalRate(index, 'endDate', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={savePricing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicPricing;