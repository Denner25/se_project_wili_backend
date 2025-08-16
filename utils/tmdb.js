const fetch = require("node-fetch");

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

function importTmdbItem(_id, mediaType) {
  const url =
    mediaType === "movie"
      ? `${BASE_URL}/movie/${_id}?api_key=${API_KEY}`
      : `${BASE_URL}/tv/${_id}?api_key=${API_KEY}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(new Error(`TMDb fetch error: ${res.status}`));
      }
      return res.json();
    })
    .then((data) => ({
      _id: _id,
      title: data.title || data.name,
      mediaType,
      poster: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "",
      length:
        mediaType === "movie"
          ? `${data.runtime} min`
          : `${data.number_of_episodes} episodes`,
      tags: [],
    }));
}

// Fetch keywords for a movie or TV show from TMDB
function fetchTmdbKeywords(_id, mediaType) {
  const url =
    mediaType === "movie"
      ? `${BASE_URL}/movie/${_id}/keywords?api_key=${API_KEY}`
      : `${BASE_URL}/tv/${_id}/keywords?api_key=${API_KEY}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(
          new Error(`TMDb keywords fetch error: ${res.status}`)
        );
      }
      return res.json();
    })
    .then((data) => data.keywords || data.results || []);
}

module.exports = { importTmdbItem, fetchTmdbKeywords };
