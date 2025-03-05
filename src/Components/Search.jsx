import React from "react";

const Search = ({ searchTerm, setSearchTerm, fetchMovies }) => {
  return (
    <div className="search">
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <img src="./search.svg" alt="Search" />

          <input
            type="text"
            placeholder="Search through thousands of Movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSubmit={(e) => fetchMovies(searchTerm)}
          />
        </div>
      </form>
    </div>
  );
};

export default Search;
