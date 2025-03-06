import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint(`https://cloud.appwrite.io/v1`)
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  const vga = Math.floor(movie.vote_average);
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        poster_path: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        id: movie.id,
        title: movie.title,
        backdrop_path: `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`,
        original_language: movie.original_language,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: vga,
        vote_count: movie.vote_count,
        genre_ids: movie.genre_ids || [],
      });
    }
  } catch (error) {
    console.error(`Error updating search count: ${error}`);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents;
  } catch (error) {
    console.error(`Error fetching trending movies: ${error}`);
  }
};
