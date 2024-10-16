import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../fuctional/Modal';
import api from '../../utils/ api';

interface AddLocationModalProps {
  onSuccess: () => void;
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleAdd = async () => {
    try {
      await api.post('/location', {
        name,
        address,
      });
      setName('');
      setAddress('');
      onSuccess();
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <Modal
      trigger={
        <button className="border p-4 mb-2 rounded-lg my-2 mr-2 text-green-500 cursor-pointer hover:bg-green-50">
          Add Location
        </button>
      }
      title="Add New Location"
    >
      <div className="p-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter location name"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter location address"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleAdd}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Add Location
        </button>
      </div>
    </Modal>
  );
};
