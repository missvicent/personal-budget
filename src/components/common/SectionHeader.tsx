interface SectionHeaderProps {
  badge: string
  title: string
  highlight: string
  description?: string
}

export default function SectionHeader({
  badge,
  title,
  highlight,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-landing-accent-2 mb-3 text-xs font-semibold tracking-[0.22em] uppercase">
        {badge}
      </p>
      <h2 className="landing-display text-2xl md:text-3xl lg:text-4xl">
        {title} <span className="landing-grad">{highlight}</span>
      </h2>
      {description && (
        <p className="text-landing-muted mx-auto mt-3 max-w-xl text-base">
          {description}
        </p>
      )}
    </div>
  )
}
