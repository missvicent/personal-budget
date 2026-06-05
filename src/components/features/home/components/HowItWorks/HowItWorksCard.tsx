interface HowItWorksCardProps {
  number: string
  title: string
  description: string
  accent?: boolean
}

export default function HowItWorksCard({
  number,
  title,
  description,
  accent = false,
}: HowItWorksCardProps) {
  const badgeStyle = accent
    ? {
        background:
          'linear-gradient(180deg, var(--landing-accent-tint), var(--landing-surface))',
        borderColor: 'var(--landing-accent)',
        color: 'var(--landing-accent-2)',
        boxShadow:
          '0 0 0 6px var(--landing-bg), 0 14px 30px -16px var(--landing-accent-glow)',
      }
    : {
        background:
          'linear-gradient(180deg, var(--landing-surface-2), var(--landing-surface))',
        borderColor: 'var(--landing-line-2)',
        color: 'var(--landing-text)',
        boxShadow:
          '0 0 0 6px var(--landing-bg), 0 14px 30px -16px var(--landing-accent-glow)',
      }

  return (
    <div className="relative text-center">
      <div
        className="landing-display relative z-10 mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border text-2xl font-semibold"
        style={badgeStyle}
      >
        {number}
      </div>
      <h3 className="landing-display text-landing-text mb-2 text-xl">
        {title}
      </h3>
      <p className="text-landing-muted mx-auto max-w-xs text-sm">
        {description}
      </p>
    </div>
  )
}
