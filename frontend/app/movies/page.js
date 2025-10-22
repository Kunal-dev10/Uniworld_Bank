"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [movie, setMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [recs, setRecs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/movies");
        const data = await res.json();
        setMovies(data);
        setMovie(data[0]);
      } catch {
        setError("⚠️ Failed to load movie list");
      }
    };
    fetchMovies();
  }, []);

  const getRecommendations = async () => {
    const formData = new URLSearchParams();
    formData.append("movie", movie);

    setLoading(true);
    setRecs([]);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        setError(`❌ ${data.error}`);
      } else {
        setRecs(data.recommendations);
      }
    } catch {
      setError("❌ Server not reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          🎬 Movie Recommender
        </h1>

        {movies.length > 0 ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Select a Movie
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                value={movie}
                onChange={(e) => setMovie(e.target.value)}
              >
                {movies.map((title, i) => (
                  <option key={i} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-lg shadow"
              onClick={getRecommendations}
            >
              🔍 Get Recommendations
            </button>
          </>
        ) : (
          <p className="text-gray-500">Loading movie list...</p>
        )}

        {error && (
          <p className="text-red-600 font-semibold mt-4 text-center">
            {error}
          </p>
        )}

        {loading && (
          <div className="text-center mt-6">
            <span className="text-gray-500">Fetching recommendations...</span>
          </div>
        )}

        {recs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Recommended Movies:
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recs.map((rec, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={rec.poster}
                    alt={rec.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 text-center">
                    <p className="font-semibold text-gray-800">{rec.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
