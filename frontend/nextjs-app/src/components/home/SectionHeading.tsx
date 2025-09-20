import { ReactNode } from 'react';

export default function SectionHeading({
  id,
  title,
  subtitle,
  icon,
}: {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div id={id} className="flex flex-col justify-center gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      </div>
      {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-1 h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </div>
  );
}
