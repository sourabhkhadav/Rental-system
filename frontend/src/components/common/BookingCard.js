import React from 'react';
import { Calendar, MapPin, Clock, User, Car, Phone, Mail } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const BookingCard = ({ 
  booking, 
  userRole = 'user',
  onCancel,
  onApprove,
  onReject,
  onContact,
  className = ''
}) => {
  const {
    _id,
    car,
    user,
    startDate,
    endDate,
    totalAmount,
    status,
    createdAt,
    pickupLocation,
    dropoffLocation,
    specialRequests
  } = booking;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className={`${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking #{_id?.slice(-6)}
          </h3>
          <p className="text-sm text-gray-500">
            Created on {formatDate(createdAt)}
          </p>
        </div>
        <Badge variant={getStatusColor(status)} className="capitalize">
          {status}
        </Badge>
      </div>

      {/* Car Information */}
      <div className="flex items-center space-x-4 mb-4 p-3 bg-gray-50 rounded-lg">
        {car?.images?.[0] ? (
          <img
            src={car.images[0]}
            alt={car.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <Car className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{car?.name}</h4>
          <p className="text-sm text-gray-600">{car?.brand}</p>
          <p className="text-sm text-blue-600 font-medium">₹{car?.pricePerDay}/day</p>
        </div>
      </div>

      {/* User Information (for owners) */}
      {userRole === 'owner' && user && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-gray-900">{user.name}</h5>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {user.phone}
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">{calculateDays()} days</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{pickupLocation || car?.pickupLocation?.city}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">₹{totalAmount}</div>
          <div className="text-sm text-gray-500">Total Amount</div>
        </div>
      </div>

      {/* Special Requests */}
      {specialRequests && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <h6 className="font-medium text-gray-900 mb-1">Special Requests:</h6>
          <p className="text-sm text-gray-700">{specialRequests}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {status === 'pending' && userRole === 'owner' && (
          <>
            <Button
              variant="success"
              size="sm"
              onClick={() => onApprove?.(booking)}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject?.(booking)}
            >
              Reject
            </Button>
          </>
        )}
        
        {status === 'confirmed' && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onCancel?.(booking)}
          >
            Cancel Booking
          </Button>
        )}
        
        {userRole === 'owner' && user && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onContact?.(user)}
          >
            Contact Customer
          </Button>
        )}
        
        {userRole === 'user' && car?.owner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onContact?.(car.owner)}
          >
            Contact Owner
          </Button>
        )}
      </div>
    </Card>
  );
};

export default BookingCard;