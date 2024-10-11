import React, { useState } from 'react';
import Modal from '../fuctional/Modal';
import axios from 'axios';
import api from '../../utils/ api';

interface EditLocationModalProps {
  locationId: number;
  name: string;
  address: string;
  onSuccess: () => void;
}

export const EditLocationModal: React.FC<EditLocationModalProps> = ({
  locationId,
  name,
  address,
  onSuccess,
}) => {
  const [newName, setNewName] = useState(name);
  const [newAddress, setNewAddress] = useState(address);

  const handleEdit = async () => {
    console.log('locationId:', locationId);
    try {
      await api.put(`/location/${locationId}`, {
        name: newName,
        address: newAddress,
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  return (
    <Modal
      trigger={
        <div className="border p-4 rounded-lg my-2 ml-2 text-orange-500 cursor-pointer hover:bg-orange-50 inline-block">
          Edit
        </div>
      }
      title="Edit location"
    >
      <div className="p-4">
        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Address:
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
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
