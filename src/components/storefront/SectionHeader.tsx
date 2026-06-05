import Link from "next/link";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={`mb-8 md:mb-10 ${centered ? "text-center max-w-2xl mx-auto" : ""} ${className}`}
    >
      <p className="section-eyebrow">{eyebrow}</p>
      <div
        className={`mt-3 flex flex-col gap-4 ${
          centered ? "items-center" : "sm:flex-row sm:items-end sm:justify-between"
        }`}
      >
        <div className={centered ? "" : "min-w-0"}>
          <h2 className="section-title">{title}</h2>
          {description && (
            <p className={`section-desc mt-2 ${centered ? "mx-auto" : "max-w-lg"}`}>
              {description}
            </p>
          )}
        </div>
        {action && (
          <Link href={action.href} className="section-link shrink-0">
            {action.label}
            <span aria-hidden> →</span>
          </Link>
        )}
      </div>
    </div>
  );
}
