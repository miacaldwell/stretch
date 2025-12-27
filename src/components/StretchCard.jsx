export default function StretchCard({ stretch, formatTime }) {
  return (
    <article className="card">
      <div className="card__media">
        {stretch.photo ? (
          <img src={stretch.photo} alt={stretch.name} />
        ) : (
          <div className="photo-placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="card__content">
        <h3>{stretch.name}</h3>
        <p>{formatTime(stretch.duration)}</p>
      </div>
    </article>
  );
}
