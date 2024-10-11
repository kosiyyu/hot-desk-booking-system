import { Search as SearchIcon } from 'lucide-react';

import React from 'react';

interface SearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}

const Search: React.FC<SearchProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
}) => {
  return (
    <div className="flex w-full justify-center items-center h-12 rounded-lg border focus-within:border-black mb-4 group">
      <input
        type="text"
        placeholder="Search locations"
        className="w-full mx-1 focus:outline-none pl-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch} className="p-2">
        <SearchIcon
          size={24}
          className="text-gray-400 group-focus-within:text-black transition-colors"
        />
      </button>
    </div>
  );
};

export default Search;
