import React, { useState } from 'react';
import Modal from '../fuctional/Modal';
import axios from 'axios';
import api from '../../utils/ api';

interface DeskModalProps {
  deskId: number;
  deskName: string;
  locationId: number;
  onSuccess: () => void;
}

export const EditDeskModal: React.FC<DeskModalProps> = ({
  deskId,
  deskName,
  locationId,
  onSuccess,
}) => {
  const [newName, setNewName] = useState(deskName);

  const handleEdit = async () => {
    try {
      console.log('deskId:', deskId);
      await api.put(`/desk/${deskId}`, {
        name: newName,
        locationId: locationId,
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating desk:', error);
    }
  };

  return (
    <Modal
      trigger={
        <div className="border p-4 rounded-lg my-2 ml-2 text-orange-500 cursor-pointer hover:bg-orange-50">
          Rename
        </div>
      }
      title="Edit Desk Name"
    >
      <div className="p-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleEdit}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};
