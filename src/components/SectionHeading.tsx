interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl mb-12 md:mb-14 ${alignClass} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600/55 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-cocoa leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-cocoa/55 text-lg leading-relaxed">{description}</p>
      )}
    </div>
  );
}
