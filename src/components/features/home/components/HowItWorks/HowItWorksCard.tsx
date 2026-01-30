interface HowItWorksCardProps {
  number: string
  title: string
  description: string
}

export default function HowItWorksCard({
  number,
  title,
  description,
}: HowItWorksCardProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-purple-800/30 bg-linear-to-b from-purple-900 to-purple-950">
        <p className="flex items-center justify-center p-5 text-4xl font-bold text-white">
          {number}
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-base text-white">{description}</p>
      </div>
    </div>
  )
}
