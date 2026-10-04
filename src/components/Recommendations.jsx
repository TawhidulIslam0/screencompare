import React from "react";
import { imageUrl } from "../services/tmdb";
import { Film } from "lucide-react";

export default function Recommendations({ left, right, onSelect }) {
  const leftRecs = left?.recommendations || [];
  const rightRecs = right?.recommendations || [];

  if (leftRecs.length === 0 && rightRecs.length === 0) return null;

  return (
    <section className="recommendations-section">
      <div className="compare-label">
        <div>
          <span className="eyebrow">DISCOVER MORE</span>
          <h2>Related titles</h2>
        </div>
      </div>

      <div className="comparison-columns">
        {/* Left Column Recommendations */}
        <div className="comparison-column">
          <div className="column-title-header">
            <h3>{left.display_title || left.title || left.name}</h3>
          </div>
          <div className="rec-grid">
            {leftRecs.map((item) => (
              <div key={item.id} className="rec-card" onClick={() => onSelect("left", item)}>
                {item.poster_path ? (
                  <img src={imageUrl(item.poster_path, "w185")} alt={item.display_title} />
                ) : (
                  <div className="rec-no-poster"><Film size={24} /></div>
                )}
                <span>{item.display_title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Recommendations */}
        <div className="comparison-column">
          <div className="column-title-header">
            <h3>{right.display_title || right.title || right.name}</h3>
          </div>
          <div className="rec-grid">
            {rightRecs.map((item) => (
              <div key={item.id} className="rec-card" onClick={() => onSelect("right", item)}>
                {item.poster_path ? (
                  <img src={imageUrl(item.poster_path, "w185")} alt={item.display_title} />
                ) : (
                  <div className="rec-no-poster"><Film size={24} /></div>
                )}
                <span>{item.display_title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}