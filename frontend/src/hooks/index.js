import { useState, useEffect, useMemo } from 'react';
import { carService, bookingService } from '../services/api';

export const DEFAULT_CAR_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwSDMwMEMzMTAuNDU3IDEyMCAzMTkgMTI4LjU0MyAzMTkgMTM5VjE2MEgzMDBWMTgwSDEwMFYxNjBIODFWMTM5QzgxIDEyOC41NDMgODkuNTQzIDEyMCAxMDAgMTIwWiIgZmlsbD0iIzM3NDE1MSIvPgo8Y2lyY2xlIGN4PSIxMjAiIGN5PSIxODAiIHI9IjIwIiBmaWxsPSIjMTExODI3Ii8+CjxjaXJjbGUgY3g9IjI4MCIgY3k9IjE4MCIgcj0iMjAiIGZpbGw9IiMxMTE4MjciLz4KPHJlY3QgeD0iMTIwIiB5PSIxNDAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMjAiIGZpbGw9IiM2Mzc0OEYiLz4KPC9zdmc+';

const addDefaultImage = (car) => ({
  ...car,
  images: car.images && car.images.length > 0 ? car.images : [DEFAULT_CAR_IMAGE]
});

export const useCars = (initialOptions = {}) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(initialOptions);

  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await carService.getAllCars(memoizedOptions);
        
        if (response.success && Array.isArray(response.cars)) {
          setCars(response.cars.map(addDefaultImage));
        } else {
          setCars([]);
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(err.message || 'Failed to fetch cars');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [memoizedOptions]);

  const updateFilters = (newOptions) => {
    setOptions(newOptions);
  };

  return { cars, loading, error, updateFilters };
};

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await bookingService.getUserBookings();
        
        if (response.success && Array.isArray(response.bookings)) {
          setBookings(response.bookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to fetch bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
};