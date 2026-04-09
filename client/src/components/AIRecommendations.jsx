import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Sparkles, BookOpen } from "lucide-react";

const GENRES = ["Fiction", "Non-Fiction", "Self-Help", "Technology", "Science", "History", "Biography"];

const AIRecommendations = () => {
  const { books = [] } = useSelector((state) => state.books);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const getRecommendations = async () => {
  if (!userInput && selectedGenres.length === 0) {
    setError("Please describe what you are looking for or select a genre.");
    return;
  }

  setLoading(true);
  setError("");
  setRecommendations([]);

  const libraryTitles = books.map((b) => b.title).join(", ");

  try {
    // ✅ Call your own backend instead of Anthropic directly
    const response = await fetch("https://shelfsync-p3eq.onrender.com/api/ai/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ sends auth cookie
      body: JSON.stringify({
        genres: selectedGenres,
        userInput,
        libraryBooks: libraryTitles,
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    setRecommendations(data.recommendations);
  } catch (err) {
    setError(err.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500">AI Powered</p>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Book Recommendations</h1>
        <p className="text-gray-500 text-sm mt-1">Tell the AI what you enjoy and get personalized picks from our library.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Input Panel */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 h-fit">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Genres you enjoy</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedGenres.includes(genre)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">What are you looking for?</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g. Something motivating about productivity, similar to Atomic Habits..."
              rows={4}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button
            onClick={getRecommendations}
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "Analyzing preferences..." : "Get AI Recommendations"}
          </button>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-2 space-y-4">
          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-400">AI is analyzing your preferences...</p>
            </div>
          )}

          {recommendations.length === 0 && !loading && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <BookOpen className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">Your personalized recommendations will appear here.</p>
            </div>
          )}

          {recommendations.map((book, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 font-black text-gray-500">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-black text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">by {book.author}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold ${book.match >= 90 ? "text-emerald-500" : book.match >= 80 ? "text-orange-500" : "text-indigo-500"}`}>
                      {book.match}% match
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      book.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {book.available ? "In Library" : "Not Available"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{book.reason}</p>
                <span className="inline-block mt-2 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {book.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AIRecommendations;