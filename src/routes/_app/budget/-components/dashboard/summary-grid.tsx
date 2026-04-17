import { StatCard } from '@/components/shared'

export interface SummaryGridItem {
  additionalDescription: string
  amountSpent?: number
  percentage?: number
  symbol: string
  title: string
}

export interface SummaryGridProps {
  summaryData: Array<SummaryGridItem>
}

export const SummaryGrid = ({ summaryData }: SummaryGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {summaryData.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          percentage={item.percentage}
          amountSpent={item.amountSpent}
          additionalDescription={item.additionalDescription}
          symbol={item.symbol}
        />
      ))}
    </div>
  )
}
