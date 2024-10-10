import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button';

type Location = {
  locationId: number;
  name: string;
  address: string;
};

export default function Locations() {
  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [locations, setLocations] = useState<Array<Location>>([
    { locationId: 1, name: 'Trading center', address: '123 Main St' },
    {
      locationId: 2,
      name: 'University of Economics Seoul',
      address: '456 Main St',
    },
    { locationId: 3, name: 'SFF', address: '789 Main St' },
    { locationId: 4, name: 'Helli Tower', address: '101 Main St' },
    { locationId: 5, name: 'Gooa', address: '112 Main St' },
  ]);

  const searchLocations = () => {
    console.log('searching locations');
    // Implement actual search logic here
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePageNumberChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setPageNumber(value);
    }
  };

  const handleGoToPage = () => {
    setPage(pageNumber);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-center items-center h-12 rounded-lg border focus-within:border-black mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full mx-1 focus:outline-none pl-1"
        />
        <button onClick={searchLocations}>
          <div>
            <Search size={24} className="rounded-lg mx-2" />
          </div>
        </button>
      </div>
      <div className="mb-4 rounded-lg border">
        {locations.map((location, index) => (
          <div
            key={location.locationId}
            className={`p-2 ${
              index !== locations.length - 1 ? 'border-b' : ''
            }`}
          >
            <div className="font-bold">{location.name}</div>
            <div className="text-xs text-gray-400">{location.address}</div>
            <div className="text-xs text-gray-400">
              ID: {location.locationId}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <div className="mx-2">Previous</div>
        </Button>

        <div className="flex items-center">
          <Button
            stretchFull={true}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            <div className="flex items-center">
              <input
                type="number"
                value={pageNumber}
                onChange={handlePageNumberChange}
                className="ml-2 pl-1 h-9 bg-black focus:outline-none"
              />
              <div className="mx-2" onClick={handleGoToPage}>
                Go
              </div>
            </div>
          </Button>
        </div>
        <Button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          <div className="mx-2">Next</div>
        </Button>
      </div>
    </div>
  );
}
