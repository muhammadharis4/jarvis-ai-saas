import Image from "next/image";

interface EmptyProps {
  /** Visible heading above the illustration */
  title?: string;
  /** Primary line (shown under the illustration) */
  label: string;
  /** Optional secondary guidance */
  hint?: string;
}

const Empty = ({ title = "Nothing here yet", label, hint }: EmptyProps) => {
  return (
    <div className="h-full py-14 md:py-20 px-6 flex flex-col items-center justify-center gap-6 text-center">
      <div className="relative h-52 w-52 md:h-72 md:w-72 opacity-95">
        <Image src="/empty.png" fill sizes="(max-width: 768px) 208px, 288px" alt="Empty state illustration" priority={false} />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{label}</p>
        {hint ? <p className="text-muted-foreground/80 text-xs leading-relaxed">{hint}</p> : null}
      </div>
    </div>
  );
};

export default Empty;
