import React from 'react';

const CalendarLegend: React.FC = () => (
  <div className="mt-2 border rounded-lg">
    <div className="flex flex-row items-center border-b py-2 pl-2">
      <div className="bg-green-200 rounded-full w-4 h-4" />
      <div className="ml-2 text-xs">Available</div>
    </div>
    <div className="flex flex-row items-center border-b py-2 pl-2">
      <div className="bg-blue-200 rounded-full w-4 h-4" />
      <div className="ml-2 text-xs">Reserved by you</div>
    </div>
    <div className="flex flex-row items-center border-b py-2 pl-2">
      <div className="bg-yellow-200 rounded-full w-4 h-4" />
      <div className="ml-2 text-xs">Reserved by others</div>
    </div>
    <div className="flex flex-row items-center py-2 pl-2">
      <div className="bg-gray-200 rounded-full w-4 h-4" />
      <div className="ml-2 text-xs">Past</div>
    </div>
  </div>
);

export default CalendarLegend;
