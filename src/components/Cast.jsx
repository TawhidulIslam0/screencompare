import { imageUrl } from "../services/tmdb";
import React, { useEffect, useMemo, useState } from "react";
export default function Cast({ left, right }) {
  const people = (item) => (item.credits?.cast || []).slice(0, 8);

  const column = (item) => (
    <div className="cast-column">
      {people(item).map((person) => (
        <div className="cast-card" key={person.id}>
          <img src={imageUrl(person.profile_path, "w185")} alt={person.name} />
          <div>
            <strong>{person.name}</strong>
            <span>{person.character || "Cast"}</span>
          </div>
        </div>
      ))}
      {!people(item).length && <div className="empty-inline">No cast information available.</div>}
    </div>
  );

  return (
    <section className="detail-section">
      <div className="section-title">
        <span className="eyebrow">CAST</span>
        <h3>Who’s in it?</h3>
      </div>
      <div className="cast-grid">{column(left)}{column(right)}</div>
    </section>
  );
}
