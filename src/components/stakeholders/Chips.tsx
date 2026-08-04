export function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "outline";
}) {
  return (
    <span
      className={
        tone === "neutral"
          ? "inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground"
          : "inline-flex items-center rounded-full border border-input px-2.5 py-1 text-xs text-muted-foreground"
      }
    >
      {children}
    </span>
  );
}
