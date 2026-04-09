import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useGoalsData } from './-hooks/use-goals-data'
import { useGoalDialog } from './-hooks/use-goal-dialog'
import { useAddFunds } from './-hooks/use-add-funds'
import { GoalCard } from './-components/goal-card'
import { GoalDialog } from './-components/goal-dialog'
import { GoalDeleteDialog } from './-components/goal-delete-dialog'
import { AddFundsDialog } from './-components/add-funds-dialog'
import type { GoalFormData } from '@/lib/schemas/goal/goal.schema'
import type { GoalWithProgress } from '@/types/goal.types'
import { Button } from '@/components/ui/button'
import { toGoalPayload } from '@/lib/schemas/goal/goal.schema'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/goal-tracker/')({
  component: GoalTrackerPage,
})

function GoalTrackerPage() {
  const {
    activeGoals,
    achievedGoals,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    isCreating,
    isUpdating,
    isDeleting,
  } = useGoalsData()

  const dialog = useGoalDialog()
  const addFunds = useAddFunds()
  const [deleteTarget, setDeleteTarget] = useState<GoalWithProgress | null>(
    null,
  )

  const handleSubmit = (data: GoalFormData) => {
    const payload = toGoalPayload(data)
    if (dialog.selectedGoal) {
      updateGoal(
        { id: dialog.selectedGoal.id, ...payload },
        {
          onSuccess: () => {
            toast.success('Goal updated')
            dialog.close()
          },
        },
      )
    } else {
      createGoal(payload, {
        onSuccess: () => {
          toast.success('Goal created')
          dialog.close()
        },
      })
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteGoal(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Goal deleted')
        setDeleteTarget(null)
      },
    })
  }

  if (isLoading) {
    return (
      <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
        <p className="text-muted-foreground">Loading goals...</p>
      </section>
    )
  }

  return (
    <section className={cn('flex flex-col gap-6', 'px-4 py-4 md:p-8')}>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Savings Goals</h1>
        <Button onClick={dialog.openCreate} className="gap-1">
          <PlusIcon className="h-4 w-4" />
          New Goal
        </Button>
      </header>

      {activeGoals.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Active</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddFunds={() => addFunds.openAddFunds(goal)}
                onEdit={() => dialog.openEdit(goal)}
                onDelete={() => setDeleteTarget(goal)}
              />
            ))}
          </div>
        </div>
      )}

      {achievedGoals.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Achieved</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {achievedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddFunds={() => addFunds.openAddFunds(goal)}
                onEdit={() => dialog.openEdit(goal)}
                onDelete={() => setDeleteTarget(goal)}
              />
            ))}
          </div>
        </div>
      )}

      {activeGoals.length === 0 && achievedGoals.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <p className="text-muted-foreground text-lg">No savings goals yet</p>
          <p className="text-muted-foreground text-sm">
            Create a goal to start tracking your savings progress
          </p>
          <Button onClick={dialog.openCreate} className="gap-1">
            <PlusIcon className="h-4 w-4" />
            Create Your First Goal
          </Button>
        </div>
      )}

      <GoalDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        onSubmit={handleSubmit}
        selectedGoal={dialog.selectedGoal}
        isPending={isCreating || isUpdating}
      />

      <AddFundsDialog
        open={addFunds.open}
        onOpenChange={(open) => {
          if (!open) addFunds.close()
        }}
        onSubmit={addFunds.handleSubmit}
        goal={addFunds.target}
        isPending={addFunds.isPending}
      />

      <GoalDeleteDialog
        open={deleteTarget !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
        deleteTarget={deleteTarget}
      />
    </section>
  )
}
