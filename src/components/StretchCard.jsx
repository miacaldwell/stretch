export default function StretchCard({ stretch }) {
  return (
    <article className="card card--library">
      <div className="card__content">
        <h3>{stretch.name}</h3>
        {stretch.instructions && <p>{stretch.instructions}</p>}
      </div>
    </article>
  );
}
