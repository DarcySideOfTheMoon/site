const items = ["● Open to work", "Remote", "Senior product design", "AI-native prototyping", "Built in public"];

export function Marquee() {
  const row = (hidden: boolean) =>
    items.map((t, i) => (
      <span className="marquee__item" key={`${hidden ? "b" : "a"}${i}`} aria-hidden={hidden || undefined}>
        {t} ·
      </span>
    ));

  return (
    <div className="marquee-wrap">
      <div className="marquee">
        <div className="marquee__track">
          <span>{row(false)}</span>
          <span aria-hidden="true">{row(true)}</span>
          <span aria-hidden="true">{row(true)}</span>
          <span aria-hidden="true">{row(true)}</span>
        </div>
      </div>
    </div>
  );
}
