import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Sparkles, BookOpen, Wand2, CheckCircle2, XCircle } from "lucide-react";

const C = {
  bg: "#faf6f0",
  bgDeep: "#f5ede0",
  bgCard: "#ffffff",
  border: "#e8ddd0",
  orange: "#f97316",
  orangeDeep: "#ea580c",
  textPrimary: "#2d1f0e",
  textMuted: "#a89070",
  textFaint: "#c4a882",
  dark: "#1a1612",
  green: "#22c55e",
};

const GENRES = ["Fiction", "Non-Fiction", "Self-Help", "Technology", "Science", "History", "Biography"];

const AIRecommendations = () => {
  const { books = [] } = useSelector((state) => state.books);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const getRecommendations = async () => {
    if (!userInput && selectedGenres.length === 0) {
      setError("Please describe what you're looking for or select at least one genre.");
      return;
    }
    setLoading(true);
    setError("");
    setRecommendations([]);

    const libraryTitles = books.map((b) => b.title).join(", ");

    try {
      const response = await fetch("https://shelfsync-api.onrender.com/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ genres: selectedGenres, userInput, libraryBooks: libraryTitles }),
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

  const matchColor = (match) => {
    if (match >= 90) return "#15803d";
    if (match >= 80) return C.orange;
    return "#6366f1";
  };

  const matchBg = (match) => {
    if (match >= 90) return "#f0fdf4";
    if (match >= 80) return "#fff7ed";
    return "#eef2ff";
  };

  const matchBorder = (match) => {
    if (match >= 90) return "#bbf7d0";
    if (match >= 80) return "rgba(249,115,22,0.2)";
    return "#c7d2fe";
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: C.bg,
        padding: "28px 28px 40px",
        fontFamily: "system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
            }}
          >
            <Sparkles size={11} color="#fff" />
          </div>
          <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: C.orange, margin: 0 }}>
            AI Powered
          </p>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.textPrimary, fontFamily: "Georgia, serif", margin: 0, letterSpacing: "-0.02em" }}>
          Book Recommendations
        </h1>
        <p style={{ fontSize: 11, color: C.textMuted, margin: "5px 0 0" }}>
          Tell the AI what you enjoy and get personalized picks from our library
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ── Input panel ── */}
        <div
          style={{
            background: C.bgCard,
            border: `1.5px solid ${C.border}`,
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Genres */}
          <div>
            <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: C.textFaint, margin: "0 0 12px" }}>
              Genres you enjoy
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {GENRES.map((genre) => {
                const active = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    style={{
                      padding: "5px 11px",
                      borderRadius: 8,
                      border: active ? `1.5px solid rgba(249,115,22,0.3)` : `1.5px solid ${C.border}`,
                      background: active ? C.dark : C.bgDeep,
                      color: active ? "#fff" : C.textMuted,
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      letterSpacing: "0.03em",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = C.textFaint;
                        e.currentTarget.style.color = C.textPrimary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.color = C.textMuted;
                      }
                    }}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: C.border }} />

          {/* Textarea */}
          <div>
            <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: C.textFaint, margin: "0 0 10px" }}>
              What are you looking for?
            </p>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="e.g. Something motivating about productivity, similar to Atomic Habits..."
              rows={5}
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 12,
                color: C.textPrimary,
                background: inputFocused ? C.bgCard : C.bgDeep,
                border: `1.5px solid ${inputFocused ? C.orange : C.border}`,
                borderRadius: 12,
                outline: "none",
                resize: "none",
                fontFamily: "system-ui, sans-serif",
                lineHeight: 1.6,
                transition: "all 0.2s ease",
                boxShadow: inputFocused ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10 }}>
              <XCircle size={13} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 11, color: "#dc2626", margin: 0, lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={getRecommendations}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? C.bgDeep : C.dark,
              color: loading ? C.textMuted : "#fff",
              border: `1.5px solid ${loading ? C.border : C.dark}`,
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.06em",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s ease",
              boxShadow: loading ? "none" : "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = C.orange;
                e.currentTarget.style.borderColor = C.orange;
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = C.dark;
                e.currentTarget.style.borderColor = C.dark;
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
              }
            }}
          >
            <Sparkles size={13} />
            {loading ? "Analyzing preferences…" : "Get AI Recommendations"}
          </button>
        </div>

        {/* ── Results panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Loading state */}
          {loading && (
            <div
              style={{
                background: C.bgCard,
                border: `1.5px solid ${C.border}`,
                borderRadius: 16,
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                padding: "60px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                  animation: "breathe 1.6s ease-in-out infinite",
                }}
              >
                <Wand2 size={16} color="#fff" />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: "Georgia, serif" }}>
                  AI is analyzing your preferences…
                </p>
                <p style={{ fontSize: 11, color: C.textMuted, margin: "5px 0 0" }}>
                  Finding the best matches from your library
                </p>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: C.orange,
                      display: "inline-block",
                      animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {recommendations.length === 0 && !loading && (
            <div
              style={{
                background: C.bgCard,
                border: `1.5px dashed ${C.border}`,
                borderRadius: 16,
                padding: "60px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: C.bgDeep,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BookOpen size={22} color={C.textFaint} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: "Georgia, serif" }}>
                  Your recommendations will appear here
                </p>
                <p style={{ fontSize: 11, color: C.textMuted, margin: "5px 0 0" }}>
                  Select genres or describe what you enjoy, then click the button
                </p>
              </div>

              {/* Hint chips */}
              <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
                {["Mystery", "Thriller", "Philosophy"].map((hint) => (
                  <span
                    key={hint}
                    style={{
                      padding: "4px 12px",
                      background: C.bgDeep,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 10,
                      color: C.textFaint,
                      fontWeight: 600,
                    }}
                  >
                    {hint}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation cards */}
          {recommendations.map((book, index) => (
            <div
              key={index}
              style={{
                background: C.bgCard,
                border: `1.5px solid ${C.border}`,
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                padding: "18px 20px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = C.textFaint;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              {/* Index badge */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: C.dark,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 900, fontFamily: "Georgia, serif" }}>
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, margin: 0, fontFamily: "Georgia, serif" }}>
                      {book.title}
                    </p>
                    <p style={{ fontSize: 11, color: C.textMuted, margin: "3px 0 0" }}>
                      by {book.author}
                    </p>
                  </div>

                  {/* Badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {/* Match % */}
                    <span
                      style={{
                        padding: "4px 10px",
                        background: matchBg(book.match),
                        border: `1px solid ${matchBorder(book.match)}`,
                        borderRadius: 8,
                        fontSize: 10,
                        fontWeight: 800,
                        color: matchColor(book.match),
                        whiteSpace: "nowrap",
                      }}
                    >
                      {book.match}% match
                    </span>

                    {/* Availability */}
                    {book.available ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px 10px",
                          background: "#f0fdf4",
                          color: "#15803d",
                          border: "1px solid #bbf7d0",
                          borderRadius: 8,
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <CheckCircle2 size={9} color="#15803d" />
                        In Library
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px 10px",
                          background: C.bgDeep,
                          color: C.textMuted,
                          border: `1px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <XCircle size={9} color={C.textFaint} />
                        Not Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Reason */}
                <p style={{ fontSize: 12, color: C.textMuted, margin: "10px 0 10px", lineHeight: 1.65 }}>
                  {book.reason}
                </p>

                {/* Category tag */}
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    background: C.bgDeep,
                    border: `1px solid ${C.border}`,
                    borderRadius: 7,
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.textFaint,
                  }}
                >
                  {book.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 14px rgba(249,115,22,0.3); }
          50% { transform: scale(1.08); box-shadow: 0 6px 20px rgba(249,115,22,0.45); }
        }
        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </main>
  );
};

export default AIRecommendations;