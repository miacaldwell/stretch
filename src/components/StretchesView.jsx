import StretchCard from "./StretchCard.jsx";

export default function StretchesView({ stretches, formatTime }) {
  const orderedStretches = [...stretches].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>Stretch Library</h2>
          <p>Hi Gordon!</p>
        </div>
      </div>

      <div className="card-grid">
        {orderedStretches.map((stretch) => (
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
