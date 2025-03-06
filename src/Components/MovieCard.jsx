import React from "react";

const MovieCard = ({ selectMovie, movie }) => {
  if (!movie) return null; // Avoids crashes if movie is undefined

  const { title, vote_average, poster_path, release_date, original_language } =
    movie;
  return (
    <div className="movie-card cursor-pointer" onClick={selectMovie}>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-poster.png"
        }
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="Rating.svg" alt="star icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>

          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
