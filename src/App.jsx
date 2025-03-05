import { useEffect, useState } from "react";
import Search from "./Components/Search";
import Spinner from "./Components/Spinner";
import MovieCard from "./Components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);

  useDebounce(
    () => {
      setDebounceSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query = "", newPage, e) => {
    e && e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&page=${newPage || pageNumber}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${
            newPage || pageNumber
          }`;

      const response = await fetch(endpoint, options);

      if (!response.ok) {
        throw new Error("An error occurred fetching movies.");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setError(data.Error || "Failed to fetch movies.");
        setMovieList([]);
        return;
      }

      setData(data);
      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setError("An error occurred fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    setTrendLoading(true);
    try {
      const trendingMovies = await getTrendingMovies();
      setTrendingMovies(trendingMovies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    } finally {
      setTrendLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const nextPage = () => {
    if (data.page < data.total_pages) {
      setPageNumber((prev) => {
        const newPage = prev + 1;
        fetchMovies(debounceSearchTerm, newPage);
        return newPage;
      });
    }
  };

  const prevPage = () => {
    if (data.page > 1) {
      setPageNumber((prev) => {
        const newPage = prev - 1;
        fetchMovies(debounceSearchTerm, newPage);
        return newPage;
      });
    }
  };

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <div className="logo">
          <img src="/logo.png" alt="logo image" />
        </div>
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            without the Hassle
          </h1>
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            fetchMovies={fetchMovies}
          />
        </header>

        {trendLoading ? (
          <Spinner />
        ) : debounceSearchTerm !== "" ? (
          ""
        ) : (
          trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )
        )}

        <section className="all-movies">
          <h2 className="mt-[40px]">Popular movies</h2>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : data?.results?.length === 0 ? (
            <p className="text-[1.3rem] text-white text-center">
              Movie not Found
            </p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-[40px]">
            <button
              className={` ${data.page === 1 ? "btn bg-gray-600" : "btn"}`}
              onClick={prevPage}
              disabled={data.page === 1}
            >
              <img src="/icon.svg" />
            </button>

            <p className="text-light-200 text-[1.2rem]">
              Page <span className="text-white">{data.page}</span> of{" "}
              {data.total_pages}
            </p>

            <button
              className={` ${
                data.page === data.total_pages ? "btn bg-gray-600" : "btn"
              }`}
              onClick={nextPage}
              disabled={data.page === data.total_pages}
            >
              <img src="/icon-left.svg" />
            </button>
          </div>
        </section>

        <hr className="h-1 w-full text-light-200 mt-[40px]" />
        <footer className="mt-[4px] flex justify-center items-center text-light-200 text-[1.2rem]">
          <p>&copy; 2025 Movies App Made with ❤️ by{" olacodes"}</p>
        </footer>
      </div>
    </main>
  );
};

export default App;
