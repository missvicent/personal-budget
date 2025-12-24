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
    <div className="mb-16 text-center lg:mb-20">
      <p className="mb-4 text-sm font-semibold tracking-wider text-purple-400 uppercase">
        {badge}
      </p>
      <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
        {title}
        <br />
        <span className="text-purple-400">{highlight}</span>
      </h2>
      {description && (
        <p className="mx-auto max-w-xl text-purple-300">{description}</p>
      )}
    </div>
  )
}
