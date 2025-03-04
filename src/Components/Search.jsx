import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="Search" />

        <input
          type="text"
          placeholder="Search through thousands of Movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
