import React from 'react';
import Modal from '../fuctional/Modal';
import axios from 'axios';
import api from '../../utils/ api';

interface DeskModalProps {
  deskId: number;
  deskName: string;
  onSuccess: () => void;
}

export const DeleteDeskModal: React.FC<DeskModalProps> = ({
  deskId,
  deskName,
  onSuccess,
}) => {
  const handleDelete = async () => {
    try {
      await api.delete(`/desk/${deskId}`);
      onSuccess();
    } catch (error) {
      console.error('Error deleting desk:', error);
    }
  };

  return (
    <Modal
      trigger={
        <div className="border p-4 rounded-lg my-2 mr-2 ml-4 text-red-500 cursor-pointer hover:bg-red-50">
          Delete
        </div>
      }
      title="Confirm Desk Deletion"
    >
      <div className="p-4">
        <p>Are you sure you want to delete the desk "{deskName}"?</p>
        <p className="text-sm text-gray-500 mt-2">
          This action cannot be undone.
        </p>
        <button
          onClick={handleDelete}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Confirm Delete
        </button>
      </div>
    </Modal>
  );
};
