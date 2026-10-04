import React, { useState, useRef, useEffect } from "react";
import { Search, X, Film, Tv, LoaderCircle } from "lucide-react";
import { imageUrl } from "../services/tmdb";

export default function SearchPicker({ label, selected, onSelect, onClear, query, setQuery, results, loading, activeSide }) {
  return (
    <section className={`picker ${activeSide ? "picker-active" : ""}`}>
      <div className="picker-heading">
        <span className="eyebrow">{label}</span>
        {selected && (
          <button className="icon-button" onClick={onClear} aria-label={`Clear ${label}`}>
            <X size={17} />
          </button>
        )}
      </div>

      {!selected ? (
        <div className="search-shell">
          <Search size={19} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a movie or TV show..."
            aria-label={`${label} search`}
          />
          {loading && <LoaderCircle className="spin" size={18} />}
        </div>
      ) : (
        <div className="selected-mini">
          <img src={imageUrl(selected.poster_path, "w185")} alt="" />
          <div>
            <strong>{selected.display_title}</strong>
            <span>{selected.media_type === "movie" ? "Movie" : "TV Show"} · {selected.display_date?.slice(0, 4) || "—"}</span>
          </div>
        </div>
      )}

      {!selected && results.length > 0 && (
        <div className="search-results">
          {results.map((result) => (
            <button key={`${result.media_type}-${result.id}`} className="result-row" onClick={() => onSelect(result)}>
              <img src={imageUrl(result.poster_path, "w92")} alt="" />
              <div className="result-copy">
                <strong>{result.display_title}</strong>
                <span>{result.media_type === "movie" ? <Film size={13} /> : <Tv size={13} />} {result.media_type === "movie" ? "Movie" : "TV Show"} · {result.display_date?.slice(0, 4) || "Unknown"}</span>
              </div>
              <span className="result-rating">{result.vote_average ? result.vote_average.toFixed(1) : "—"}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
