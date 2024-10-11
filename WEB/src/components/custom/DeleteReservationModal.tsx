import React, { useState } from 'react';
import axios from 'axios';
import api from '../../utils/ api';

interface DeleteReservationModalProps {
  userId: number;
  deskId: number;
  reservationId: number;
  reservationDate: string;
  onSuccess: () => void;
  onClose: () => void;
}

const DeleteReservationModal: React.FC<DeleteReservationModalProps> = ({
  userId,
  deskId,
  reservationId,
  reservationDate,
  onSuccess,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteReservation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/reservation/${reservationId}/${userId}`);
      onSuccess();
    } catch (error: any) {
      console.error('Error deleting reservation:', error);
      if (error.response && error.response.status === 401) {
        setError('You are not authorized to delete this reservation.');
      } else {
        setError('Failed to delete reservation. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">
          Are you sure you want to delete the reservation for desk {deskId} on{' '}
          {reservationDate}?
        </p>
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
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={deleteReservation}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReservationModal;
