import StretchCard from "./StretchCard.jsx";

const BODY_SYSTEM_ORDER = [
  "Neck",
  "Shoulders & Chest",
  "Spine & Back",
  "Hips & Glutes",
  "Hamstrings & Legs",
  "Full Body / Flow"
];

const groupStretchesByTag = (stretches) =>
  stretches.reduce((groups, stretch) => {
    const tags = stretch.tags?.length ? stretch.tags : ["Other"];
    tags.forEach((tag) => {
      if (!groups[tag]) {
        groups[tag] = [];
      }
      groups[tag].push(stretch);
    });
    return groups;
  }, {});

export default function StretchesView({ stretches }) {
  const grouped = groupStretchesByTag(stretches);
  const orderedTags = [
    ...BODY_SYSTEM_ORDER.filter((tag) => grouped[tag]?.length),
    ...Object.keys(grouped)
      .filter((tag) => !BODY_SYSTEM_ORDER.includes(tag))
      .sort((a, b) => a.localeCompare(b))
  ];

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>Stretch Library</h2>
          <p>Organized by body system.</p>
        </div>
      </div>

      <div className="library">
        {orderedTags.map((tag) => (
          <div key={tag} className="library__section">
            <div className="library__header">
              <h3>{tag}</h3>
              <span className="library__count">
                {grouped[tag].length} stretches
              </span>
            </div>
            <div className="carousel">
              <div className="carousel__track">
                <div className="carousel__track-inner">
                  {grouped[tag].map((stretch) => (
                    <StretchCard key={stretch.id} stretch={stretch} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
