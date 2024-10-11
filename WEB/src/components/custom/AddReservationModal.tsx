import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AddReservationModalProps {
  userId: number;
  deskId: number;
  reservationDate: string;
  onSuccess: () => void;
  onClose: () => void;
}

const AddReservationModal: React.FC<AddReservationModalProps> = ({
  userId,
  deskId,
  reservationDate,
  onSuccess,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ReservationModal userId:', userId, 'deskId:', deskId);
  }, [userId, deskId]);

  const makeReservation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Making reservation with userId:', userId, 'deskId:', deskId);
      const response = await axios.post(
        'http://localhost:5106/api/reservation',
        {
          userId,
          deskId,
          reservationDate,
        },
      );
      console.log('Reservation response:', response.data);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error making reservation:', error);
      setError('Failed to make reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">Confirm Reservation</h2>
        <p className="mb-4">
          Do you want to make a reservation for desk {deskId} on{' '}
          {reservationDate}?
        </p>
        <p className="mb-4">User ID: {userId}</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={makeReservation}
            disabled={isLoading}
          >
            {isLoading ? 'Reserving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReservationModal;
