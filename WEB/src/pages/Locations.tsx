import React, { useState, useEffect } from 'react';
import Search from '../components/custom/Search';
import { Button } from '../components/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AddLocationModal } from '../components/custom/AddLocationModal';
import { isAdmin } from '../utils/auth';
import { EditLocationModal } from '../components/custom/EditLocationModal';

type Location = {
  locationId: number;
  name: string;
  address: string;
};

type SearchResponse = {
  locations: Location[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

const ITEMS_PER_PAGE = 10;

export default function Locations() {
  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const admin = isAdmin();

  useEffect(() => {
    fetchLocations();
  }, [page, searchTerm]);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<SearchResponse>(
        'http://localhost:5106/api/location/search',
        {
          params: {
            searchTerm,
            page,
            pageSize: ITEMS_PER_PAGE,
          },
        },
      );
      setLocations(response.data.locations);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchLocations();
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setPageNumber(value);
    }
  };

  const handleRemoveLocation = async (locationId: number) => {
    try {
      await axios.delete(`http://localhost:5106/api/location/${locationId}`);

      fetchLocations();
      setErrorMessage(null);
    } catch (error) {
      console.error('Error removing location:', error);
      setErrorMessage('Failed to delete location. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="text-xl font-semibold mt-4">Locations</div>
      <div className="flex flex-col w-full">
        <div className="w-40 pb-2">
          <AddLocationModal onSuccess={fetchLocations} />
        </div>
        <div className="flex justify-between items-center mb-4">
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errorMessage}
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-4 text-sm text-red-500"
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="mb-4 rounded-lg border">
          {locations.length > 0 ? (
            locations.map((location, index) => (
              <div
                key={location.locationId}
                className={`p-2 ${
                  index !== locations.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">
                      <Link to={`location/${location.locationId}`}>
                        {location.name}
                      </Link>
                    </div>
                    <div className="text-xs text-gray-400">
                      {location.address}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {location.locationId}
                    </div>
                  </div>

                  {admin && (
                    <div className="flex justify-between items-center pr-2">
                      <button
                        onClick={() =>
                          handleRemoveLocation(location.locationId)
                        }
                        className="border p-4 rounded-lg my-2 mr-2 text-red-500 cursor-pointer hover:bg-red-50"
                      >
                        Remove
                      </button>
                      <EditLocationModal
                        locationId={location.locationId}
                        name={location.name}
                        address={location.address}
                        onSuccess={fetchLocations}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">
              No locations found
            </div>
          )}
        </div>
      )}
      <div className="flex justify-between items-start">
        <Button
          onClick={handlePrevPage}
          disabled={page === 1 || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <div className="mx-2">Previous</div>
        </Button>

        <div className="flex flex-col items-center">
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
                disabled
              />
            </div>
          </Button>
          <div className="mt-2 text-gray-500 text-center text-xs">
            Page {page} of {totalPages} | Total Locations: {totalCount}
          </div>
        </div>

        <Button
          onClick={handleNextPage}
          disabled={page === totalPages || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <div className="mx-2">Next</div>
        </Button>
      </div>
    </div>
  );
}
