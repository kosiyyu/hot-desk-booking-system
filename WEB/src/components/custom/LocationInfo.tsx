import React from 'react';

type LocationInfoProps = {
  name: string;
  address: string;
  locationId: number;
};

const LocationInfo: React.FC<LocationInfoProps> = ({
  name,
  address,
  locationId,
}) => (
  <div className="w-1/2">
    <div className="text-2xl font-bold">{name}</div>
    <div className="text-xs text-gray-400">{address}</div>
    <div className="text-xs text-gray-400">ID: {locationId}</div>
  </div>
);

export default LocationInfo;
