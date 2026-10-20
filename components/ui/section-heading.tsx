import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  id?: string;
}

export function SectionHeading({
  title,
  description,
  className,
  align = "left",
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2
        id={id}
        className="font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-base text-text-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
