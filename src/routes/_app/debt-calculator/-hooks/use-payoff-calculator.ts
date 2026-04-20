import { useMemo, useState } from 'react'
import {
  calculateAvalanche,
  calculateSnowball,
} from '../-lib/payoff-strategies'
import type { DebtInput, PayoffResult } from '../-lib/payoff-strategies'
import type { Debt } from '@/types/database.types'

export function usePayoffCalculator(debts: Array<Debt>) {
  const [extraPayment, setExtraPayment] = useState(0)

  const debtInputs: Array<DebtInput> = useMemo(
    () =>
      debts.map((d) => ({
        debtId: d.id,
        name: d.name,
        balance: d.current_balance,
        interestRate: d.interest_rate,
        minimumPayment: d.minimum_payment,
      })),
    [debts],
  )

  const snowball: PayoffResult = useMemo(
    () => calculateSnowball(debtInputs, extraPayment),
    [debtInputs, extraPayment],
  )

  const avalanche: PayoffResult = useMemo(
    () => calculateAvalanche(debtInputs, extraPayment),
    [debtInputs, extraPayment],
  )

  const interestSaved = useMemo(
    () =>
      Math.round(
        (snowball.totalInterestPaid - avalanche.totalInterestPaid) * 100,
      ) / 100,
    [snowball, avalanche],
  )

  return { snowball, avalanche, extraPayment, setExtraPayment, interestSaved }
}
