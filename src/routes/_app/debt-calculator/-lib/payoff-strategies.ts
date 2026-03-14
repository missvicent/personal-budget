export interface DebtInput {
  debtId: string
  name: string
  balance: number
  interestRate: number
  minimumPayment: number
}

export interface PayoffResult {
  strategy: 'snowball' | 'avalanche'
  totalMonths: number
  totalInterestPaid: number
  totalPaid: number
  debtPayoffOrder: Array<{
    debtId: string
    name: string
    payoffMonth: number
    totalInterestForDebt: number
  }>
}

const MAX_MONTHS = 360

function simulatePayoff(
  debts: Array<DebtInput>,
  extraMonthly: number,
  sortFn: (a: DebtInput, b: DebtInput) => number,
  strategyLabel: 'snowball' | 'avalanche',
): PayoffResult {
  if (debts.length === 0) {
    return {
      strategy: strategyLabel,
      totalMonths: 0,
      totalInterestPaid: 0,
      totalPaid: 0,
      debtPayoffOrder: [],
    }
  }

  const sorted = [...debts].sort(sortFn)
  const balances = new Map(sorted.map((d) => [d.debtId, d.balance]))
  const interestAccum = new Map(sorted.map((d) => [d.debtId, 0]))
  const payoffOrder: PayoffResult['debtPayoffOrder'] = []
  let totalPaid = 0
  let month = 0

  while (month < MAX_MONTHS) {
    const activeDebts = sorted.filter((d) => (balances.get(d.debtId) ?? 0) > 0)
    if (activeDebts.length === 0) break

    month++
    let extraRemaining = extraMonthly

    // Apply interest to all active debts
    for (const debt of activeDebts) {
      const bal = balances.get(debt.debtId)!
      const monthlyInterest = bal * (debt.interestRate / 12 / 100)
      balances.set(debt.debtId, bal + monthlyInterest)
      interestAccum.set(
        debt.debtId,
        (interestAccum.get(debt.debtId) ?? 0) + monthlyInterest,
      )
    }

    // Pay minimums on all active debts
    for (const debt of activeDebts) {
      const bal = balances.get(debt.debtId)!
      const payment = Math.min(debt.minimumPayment, bal)
      balances.set(debt.debtId, bal - payment)
      totalPaid += payment

      if (balances.get(debt.debtId)! <= 0.01) {
        balances.set(debt.debtId, 0)
        payoffOrder.push({
          debtId: debt.debtId,
          name: debt.name,
          payoffMonth: month,
          totalInterestForDebt: interestAccum.get(debt.debtId) ?? 0,
        })
        extraRemaining += debt.minimumPayment - payment
      }
    }

    // Apply extra payment to the target debt (first active in sorted order)
    const target = sorted.find((d) => (balances.get(d.debtId) ?? 0) > 0)
    if (target && extraRemaining > 0) {
      const bal = balances.get(target.debtId)!
      const extraPayment = Math.min(extraRemaining, bal)
      balances.set(target.debtId, bal - extraPayment)
      totalPaid += extraPayment

      if (balances.get(target.debtId)! <= 0.01) {
        balances.set(target.debtId, 0)
        if (!payoffOrder.some((p) => p.debtId === target.debtId)) {
          payoffOrder.push({
            debtId: target.debtId,
            name: target.name,
            payoffMonth: month,
            totalInterestForDebt: interestAccum.get(target.debtId) ?? 0,
          })
        }
      }
    }
  }

  // Any debts still remaining after MAX_MONTHS
  for (const debt of sorted) {
    if (
      (balances.get(debt.debtId) ?? 0) > 0 &&
      !payoffOrder.some((p) => p.debtId === debt.debtId)
    ) {
      payoffOrder.push({
        debtId: debt.debtId,
        name: debt.name,
        payoffMonth: MAX_MONTHS,
        totalInterestForDebt: interestAccum.get(debt.debtId) ?? 0,
      })
    }
  }

  const totalInterestPaid = Array.from(interestAccum.values()).reduce(
    (sum, v) => sum + v,
    0,
  )

  return {
    strategy: strategyLabel,
    totalMonths: month,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    debtPayoffOrder: payoffOrder.map((p) => ({
      ...p,
      totalInterestForDebt: Math.round(p.totalInterestForDebt * 100) / 100,
    })),
  }
}

export function calculateSnowball(
  debts: Array<DebtInput>,
  extraMonthly: number,
): PayoffResult {
  return simulatePayoff(
    debts,
    extraMonthly,
    (a, b) => a.balance - b.balance,
    'snowball',
  )
}

export function calculateAvalanche(
  debts: Array<DebtInput>,
  extraMonthly: number,
): PayoffResult {
  return simulatePayoff(
    debts,
    extraMonthly,
    (a, b) => b.interestRate - a.interestRate,
    'avalanche',
  )
}
