import React, { useEffect, useState } from "react";

const MovieModal = ({ convertGenres, onClose, isOpen, movie, options }) => {
  if (!isOpen) return null;

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const [trailerUrl, setTrailerUrl] = useState(null);

  const {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    id,
    vote_count,
    overview,
    backdrop_path,
    genre_ids,
  } = movie;

  async function getTrailer(movieId) {
    const apiKey = API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      // Find the first available video
      const trailer = data.results[0];

      setTrailerUrl(
        trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
      );
    } catch (error) {
      console.error("Error fetching trailer:", error);
      setTrailerUrl(null);
    }
  }

  useEffect(() => {
    if (id) getTrailer(id);
  }, [id]);

  return (
    <div
      className="fixed inset-0 h-[100dvh] flex items-center justify-center z-50 bg-dark-100 bg-opacity-90 "
      onClick={onClose}
    >
      <div
        className="modal-content m-gradient max-[480px]:px-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* modal header  */}
        <div className="modal-header flex-wrap gap-2">
          <h2>{title}</h2>
          <div className="flex items-center justify-center gap-[10px]">
            <div className="flex items-center justify-center px-[16px] py-[8px] bg-[#221F3D] rounded-md">
              <img src="/Rating.svg" alt="star icon" />
              <p className="text-light-200 pl-1">
                <span className="text-white font-medium">
                  {vote_average ? vote_average.toFixed(1) : "N/A"}
                </span>
                /10 ({vote_count}K)
              </p>
            </div>
            <div className="flex items-center justify-center px-[16px] py-[8px] bg-[#221F3D] rounded-md">
              <img src="rate.svg" alt="" />
              <p className="text-light-200 pl-1.5">1</p>
            </div>
          </div>
        </div>

        <div className="mt-3.5 text-light-200 max-[888px]:hidden">
          {release_date ? release_date.split("-")[0] : "N/A"} • PG-16 • 2h 15m
        </div>

        {/* modal body  */}
        <div className="modal-body mt-[2.3rem]">
          {/* poster and video */}
          <div className="posters flex items-center flex-row gap-[25px]">
            <img
              className="w-[305px] h-[440px] object-cover rounded-md max-[888px]:hidden"
              src={
                poster_path
                  ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                  : "/no-poster.png"
              }
              alt={title}
            />
            <div className="w-full aspect-video rounded-md">
              {trailerUrl ? (
                <iframe
                  className="w-full h-full rounded-md"
                  src={trailerUrl}
                  title={title}
                  allowFullScreen
                ></iframe>
              ) : (
                <img
                  className="object-cover w-full h-full rounded-md"
                  src={
                    backdrop_path
                      ? `https://image.tmdb.org/t/p/w500/${backdrop_path}`
                      : "/n-vid.png"
                  }
                  alt={title}
                />
              )}
            </div>
          </div>

          <div className="flex items-center my-8 w-full relative min-[888px]:hidden max-sm:flex-wrap">
            <div className=" text-light-200">
              {release_date ? release_date.split("-")[0] : "N/A"} • PG-16 • 2h
              15m
            </div>
            <button
              className="min-[488px]:absolute right-0 px-[15px] py-[8px] bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-md cursor-pointer hover:scale-105 transform transition-all duration-300 ease-in-out"
              onClick={onClose}
            >
              <p className="flex items-center text-[16px] font-[600] text-[#121212] gap-2">
                Visit Homepage{" "}
                <span>
                  <img
                    src="home.png"
                    alt=""
                    width={"20.3px"}
                    height={"10.3px"}
                  />
                </span>
              </p>
            </button>
          </div>

          {/* movie details */}

          <div className="movie-details mt-[2.3rem]">
            <div className="flex max-xs:flex-col xs:items-center genre gap-[3rem] max-xs:gap-2 w-full relative max-xs:mb-[2rem]">
              <h3 className="text-[1.15rem] text-light-200">Genres</h3>
              <p className="text-light-200 left-[8rem] min-xs:absolute">
                {convertGenres(genre_ids).map((genre, index) => (
                  <span
                    key={index}
                    className="max-xs:flex items-center max-xs:flex-wrap max-xs:mb-1.5 text-white font-medium text-[1rem] py-2 px-5 bg-[#221F3D] rounded-md min-[480px]:mr-2"
                  >
                    {genre}
                  </span>
                ))}
              </p>
              <button
                className="absolute right-0 px-[18px] py-[8px] bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-md cursor-pointer hover:scale-105 transform transition-all duration-300 ease-in-out max-[888px]:hidden"
                onClick={onClose}
              >
                <p className="flex items-center text-[16px] font-[600] text-[#121212] gap-2">
                  Visit Homepage{" "}
                  <span>
                    <img
                      src="home.png"
                      alt=""
                      width={"20.3px"}
                      height={"10.3px"}
                    />
                  </span>
                </p>
              </button>
            </div>

            {/* overview */}

            <div className="flex max-xs:flex-col genre gap-[1rem] w-full relative mt-7 max-xs:mb-[1rem]">
              <h3 className="text-[1.15rem] text-light-200">Overview</h3>
              <p className="text-light-200 w-[75%] max-xs:w-[100%] text-[1.1rem] min-xs:absolute left-[8rem]">
                {overview ? overview : "No overview available for this movie"}
              </p>
            </div>

            {/* release_date */}

            <div className="flex max-xs:flex-col genre gap-[1rem] w-full relative mt-[5.5rem] max-[888px]:mt-[8.8rem] max-xs:mt-[2rem]">
              <h3 className="text-[1.15rem] text-light-200">Release date</h3>
              <p className="text-light-200 w-[60%] max-sm:w-full text-[1.1rem] min-xs:absolute left-[8rem]">
                {release_date ? release_date : "N/A"} (Worldwide)
              </p>
            </div>

            {/* countries */}

            <div className="flex max-xs:flex-col genre gap-[1rem] w-full relative mt-5 max-sm:mt-[2rem]">
              <h3 className="text-[1.15rem] text-light-200">Countries</h3>
              <p className="text-light-200 w-[60%] max-xs:w-full text-[1.1rem] min-xs:absolute left-[8rem]">
                United Stated <span>•</span> Canada <span>•</span> UAE{" "}
                <span>•</span> Hungary <span>•</span>
                Italy <span>•</span> New Zealand
              </p>
            </div>

            {/* status */}

            <div className="flex  genre gap-[3rem] w-full relative mt-5 max-xs:mt-[2rem]">
              <h3 className="text-[1.15rem] text-light-200">Status</h3>
              <p className="text-light-200 w-[60%] text-[1.1rem] absolute left-[8rem]">
                Released
              </p>
            </div>

            {/* original_language */}

            <div className="flex  genre gap-[3rem] w-full relative mt-[2rem] mb-[30px]">
              <h3 className="text-[1.15rem] text-light-200">Language</h3>
              <p className="text-light-200 w-[60%] text-[1.1rem] absolute left-[8rem]">
                {original_language ? original_language.toUpperCase() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
