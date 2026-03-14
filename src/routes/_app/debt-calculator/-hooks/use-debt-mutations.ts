import { useState } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { debtService } from '@/services/debt.service'
import type { DebtFormData, DebtPaymentFormData } from '@/lib/validations/debt.schema'
import { toDebtPayload, toDebtPaymentPayload } from '@/lib/validations/debt.schema'
import { toast } from 'sonner'

export function useDebtMutations() {
  const supabase = useSupabase()
  const [isPending, setIsPending] = useState(false)

  const createDebt = async (data: DebtFormData) => {
    setIsPending(true)
    try {
      await debtService.create(toDebtPayload(data), supabase)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create debt',
      )
    } finally {
      setIsPending(false)
    }
  }

  const updateDebt = async (id: string, data: Partial<DebtFormData>) => {
    setIsPending(true)
    try {
      await debtService.update(id, data, supabase)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update debt',
      )
    } finally {
      setIsPending(false)
    }
  }

  const deleteDebt = async (id: string) => {
    setIsPending(true)
    try {
      await debtService.delete(id, supabase)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete debt',
      )
    } finally {
      setIsPending(false)
    }
  }

  const recordPayment = async (
    debtId: string,
    currentBalance: number,
    annualRate: number,
    data: DebtPaymentFormData,
  ) => {
    setIsPending(true)
    try {
      const payload = toDebtPaymentPayload(data, debtId, currentBalance, annualRate)
      await debtService.recordPayment(
        {
          p_debt_id: payload.debt_id,
          p_amount_paid: payload.amount_paid,
          p_principal_paid: payload.principal_paid,
          p_interest_paid: payload.interest_paid,
          p_payment_date: payload.payment_date,
          p_notes: payload.notes,
        },
        supabase,
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to record payment',
      )
    } finally {
      setIsPending(false)
    }
  }

  return { createDebt, updateDebt, deleteDebt, recordPayment, isPending }
}
