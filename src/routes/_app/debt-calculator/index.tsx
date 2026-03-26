import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { DebtDBProvider } from './-hooks/use-debt-db'
import { useDebts } from './-hooks/use-debts'
import { useDebtMutations } from './-hooks/use-debt-mutations'
import { useDebtDialog } from './-hooks/use-debt-dialog'
import { usePayoffCalculator } from './-hooks/use-payoff-calculator'
import {
  DebtForm,
  DebtList,
  DebtSummary,
  PaymentForm,
  PayoffComparison,
} from './-components'
import type {
  DebtFormData,
  DebtPaymentFormData,
} from '@/lib/validations/debt.schema'
import type { Debt } from '@/types/database.types'
import { staticToolbarMeta } from '@/lib/toolbar'
import { cn } from '@/lib/utils'
import { Dialog } from '@/components/ui/dialog'

export const Route = createFileRoute('/_app/debt-calculator/')({
  beforeLoad: staticToolbarMeta({
    title: 'Debt Calculator',
    description: 'Track debts and plan payoff strategies',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DebtDBProvider>
      <DebtCalculatorPage />
    </DebtDBProvider>
  )
}

function DebtCalculatorPage() {
  const { data: rawDebts = [] } = useDebts()
  const debtList = rawDebts as unknown as Array<Debt>
  const mutations = useDebtMutations()
  const dialog = useDebtDialog()
  const payoff = usePayoffCalculator(debtList)

  const handleDebtSubmit = (data: DebtFormData) => {
    if (dialog.selectedDebt) {
      mutations.updateDebt(dialog.selectedDebt.id, data)
    } else {
      mutations.createDebt(data)
    }
    dialog.onOpenChange(false)
  }

  const handlePaymentSubmit = (data: DebtPaymentFormData) => {
    if (dialog.selectedDebt) {
      mutations.recordPayment(
        dialog.selectedDebt.id,
        dialog.selectedDebt.current_balance,
        dialog.selectedDebt.interest_rate,
        data,
      )
    }
    dialog.onOpenChange(false)
  }

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
      <header className="flex items-center justify-end">
        <button
          onClick={() => dialog.openDebtForm()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Debt
        </button>
      </header>

      <DebtSummary debts={debtList} />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <DebtList
            debts={debtList}
            onEdit={(debt) => dialog.openDebtForm(debt)}
            onRecordPayment={(debt) => dialog.openPaymentForm(debt)}
            onDelete={(id) => mutations.deleteDebt(id)}
            isDeleting={mutations.isPending}
          />
        </div>
        <div className="w-full md:w-80">
          <PayoffComparison
            snowball={payoff.snowball}
            avalanche={payoff.avalanche}
            extraPayment={payoff.extraPayment}
            onExtraPaymentChange={payoff.setExtraPayment}
            interestSaved={payoff.interestSaved}
          />
        </div>
      </div>

      <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
        {dialog.mode === 'debt' ? (
          <DebtForm
            onSubmit={handleDebtSubmit}
            selectedDebt={dialog.selectedDebt}
            isPending={mutations.isPending}
          />
        ) : dialog.selectedDebt ? (
          <PaymentForm
            debt={dialog.selectedDebt}
            onSubmit={handlePaymentSubmit}
            isPending={mutations.isPending}
          />
        ) : null}
      </Dialog>
    </section>
  )
}
