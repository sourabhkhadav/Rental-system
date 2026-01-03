import { useState, useEffect } from 'react';

// Single backup car image that always works
const DEFAULT_CAR_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwSDMwMEMzMTAuNDU3IDEyMCAzMTkgMTI4LjU0MyAzMTkgMTM5VjE2MEgzMDBWMTgwSDEwMFYxNjBIODFWMTM5QzgxIDEyOC41NDMgODkuNTQzIDEyMCAxMDAgMTIwWiIgZmlsbD0iIzM3NDE1MSIvPgo8Y2lyY2xlIGN4PSIxMjAiIGN5PSIxODAiIHI9IjIwIiBmaWxsPSIjMTExODI3Ii8+CjxjaXJjbGUgY3g9IjI4MCIgY3k9IjE4MCIgcj0iMjAiIGZpbGw9IiMxMTE4MjciLz4KPHJlY3QgeD0iMTIwIiB5PSIxNDAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMjAiIGZpbGw9IiM2Mzc0OEYiLz4KPC9zdmc+';

// Export for use in other components
export { DEFAULT_CAR_IMAGE };

// Hook for fetching cars
export const useCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCars([
          {
            _id: '1',
            name: 'Swift Dzire',
            brand: 'Maruti Suzuki',
            fuelType: 'petrol',
            seats: 5,
            transmission: 'manual',
            pricePerDay: 1200,
            pickupLocation: { city: 'Mumbai', address: 'Andheri West' },
            rating: 4.5,
            totalRatings: 12,
            images: [DEFAULT_CAR_IMAGE],
            owner: { name: 'Rajesh Kumar', rating: 4.8 }
          },
          {
            _id: '2',
            name: 'Honda City',
            brand: 'Honda',
            fuelType: 'petrol',
            seats: 5,
            transmission: 'automatic',
            pricePerDay: 1800,
            pickupLocation: { city: 'Mumbai', address: 'Bandra East' },
            rating: 4.8,
            totalRatings: 25,
            images: [DEFAULT_CAR_IMAGE],
            owner: { name: 'Rajesh Kumar', rating: 4.8 }
          },
          {
            _id: '3',
            name: 'Hyundai Creta',
            brand: 'Hyundai',
            fuelType: 'diesel',
            seats: 5,
            transmission: 'automatic',
            pricePerDay: 2500,
            pickupLocation: { city: 'Delhi', address: 'Connaught Place' },
            rating: 4.7,
            totalRatings: 18,
            images: [DEFAULT_CAR_IMAGE],
            owner: { name: 'Priya Sharma', rating: 4.6 }
          },
          {
            _id: '4',
            name: 'Toyota Innova',
            brand: 'Toyota',
            fuelType: 'diesel',
            seats: 7,
            transmission: 'manual',
            pricePerDay: 3000,
            pickupLocation: { city: 'Bangalore', address: 'Koramangala' },
            rating: 4.6,
            totalRatings: 15,
            images: [DEFAULT_CAR_IMAGE],
            owner: { name: 'Amit Patel', rating: 4.5 }
          },
          {
            _id: '5',
            name: 'Mahindra XUV700',
            brand: 'Mahindra',
            fuelType: 'petrol',
            seats: 7,
            transmission: 'automatic',
            pricePerDay: 3500,
            pickupLocation: { city: 'Bangalore', address: 'Whitefield' },
            rating: 4.9,
            totalRatings: 22,
            images: [DEFAULT_CAR_IMAGE],
            owner: { name: 'Amit Patel', rating: 4.5 }
          },
          {
            _id: '6',
            name: 'Tata Nexon',
            brand: 'Tata',
            fuelType: 'petrol',
            seats: 5,
            transmission: 'manual',
            pricePerDay: 1500,
            pickupLocation: { city: 'Delhi', address: 'Karol Bagh' },
            rating: 4.3,
            totalRatings: 8,
            images: [DEFAULT_CAR_IMAGE],
            owner: { name: 'Priya Sharma', rating: 4.6 }
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchCars();
  }, []);

  const updateFilters = () => {
    // Filter functionality can be added here
  };

  return {
    cars,
    loading,
    updateFilters
  };
};

// Hook for managing bookings
export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = () => {
      setLoading(true);
      setTimeout(() => {
        setBookings([
          {
            _id: '1',
            car: {
              name: 'Swift Dzire',
              brand: 'Maruti',
              images: [DEFAULT_CAR_IMAGE]
            },
            startDate: '2024-01-25',
            endDate: '2024-01-27',
            status: 'accepted',
            finalAmount: 3780
          }
        ]);
        setLoading(false);
      }, 500);
    };

    fetchBookings();
  }, []);

  return {
    bookings,
    loading
  };
};