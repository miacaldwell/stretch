import StretchCard from "./StretchCard.jsx";

export default function StretchesView({ stretches, formatTime }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>Stretch Library</h2>
          <p>Add new holds to keep your routines flexible.</p>
        </div>
      </div>

      <div className="card-grid">
        {stretches.map((stretch) => (
          <StretchCard
            key={stretch.id}
            stretch={stretch}
            formatTime={formatTime}
          />
        ))}
      </div>
    </section>
  );
}
