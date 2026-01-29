import { StatCard } from '@/components/shared'

export interface SummaryGridProps {
  summaryData: Array<{
    title: string
    percentage?: number
    badgeType?: 'positive' | 'negative'
    amountSpent: number
    additionalDescription: string
  }>
}
export const SummaryGrid = ({ summaryData }: SummaryGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {summaryData.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          percentage={item.percentage}
          badgeType={item.badgeType}
          amountSpent={item.amountSpent}
          additionalDescription={item.additionalDescription}
        />
      ))}
    </div>
  )
}
