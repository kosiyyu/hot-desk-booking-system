import React, { ReactNode, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  trigger: React.ReactNode;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ trigger, children, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="w-full">
      <div onClick={openModal} className="w-full">
        {trigger}
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="relative w-auto max-w-3xl mx-auto my-6 z-50">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                <h3 className="text-2xl font-semibold">{title || 'Modal'}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={closeModal}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="relative p-6 flex-auto">{children}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
