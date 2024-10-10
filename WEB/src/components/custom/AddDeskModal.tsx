import axios from 'axios';
import Modal from '../fuctional/Modal';
import { useState } from 'react';

interface AddDeskModalProps {
  locationId: number;
  onSuccess: () => void;
  userId: number;
}

export const AddDeskModal: React.FC<AddDeskModalProps> = ({
  locationId,
  onSuccess,
  userId = 2,
}) => {
  const [newDeskName, setNewDeskName] = useState('');

  const handleAdd = async () => {
    try {
      await axios.post(`http://localhost:5106/api/desk`, {
        name: newDeskName,
        locationId: locationId,
        userId: userId,
      });
      setNewDeskName(''); // Reset input
      onSuccess();
    } catch (error) {
      console.error('Error adding desk:', error);
    }
  };

  return (
    <Modal
      trigger={
        <button className="w-full p-2 mt-2 border rounded-lg text-center text-green-500 hover:bg-green-50">
          Add
        </button>
      }
      title="Add New Desk"
    >
      <div className="p-4">
        <input
          type="text"
          value={newDeskName}
          onChange={(e) => setNewDeskName(e.target.value)}
          placeholder="Enter desk name"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAdd}
          className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Add Desk
        </button>
      </div>
    </Modal>
  );
};
