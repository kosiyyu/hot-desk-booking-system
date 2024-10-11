import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../fuctional/Modal';

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
      await axios.post('http://localhost:5106/api/location', {
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
        <div className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Add Location
        </div>
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
