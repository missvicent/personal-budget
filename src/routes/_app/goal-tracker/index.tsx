import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Layers,
  PlusIcon,
  Target,
  TrendingUp,
  Trophy,
  Wallet,
} from 'lucide-react'
import { toast } from 'sonner'
import { useGoalsData } from './-hooks/use-goals-data'
import { useGoalDialog } from './-hooks/use-goal-dialog'
import { useAddFunds } from './-hooks/use-add-funds'
import { GoalCard } from './-components/goal-card'
import { GoalDialog } from './-components/goal-dialog'
import { GoalDeleteDialog } from './-components/goal-delete-dialog'
import { AddFundsDialog } from './-components/add-funds-dialog'
import type { LucideIcon } from 'lucide-react'
import type { GoalFormData } from '@/lib/schemas/goal/goal.schema'
import type { GoalWithProgress } from '@/types/goal.types'
import { Button } from '@/components/ui/button'
import { toGoalPayload } from '@/lib/schemas/goal/goal.schema'
import { cn } from '@/lib/utils'

const GOAL_FEATURES: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    icon: TrendingUp,
    title: 'Visual progress',
    description: 'Progress bars so you always know how close you are',
  },
  {
    icon: Wallet,
    title: 'Log deposits',
    description: 'Add contributions anytime and watch your goal fill up',
  },
  {
    icon: Layers,
    title: 'Run several at once',
    description: 'Travel, emergency, down payment — track them side-by-side',
  },
  {
    icon: Trophy,
    title: 'Celebrate finishes',
    description:
      'Goals move to Achieved so you can see what you’ve already won',
  },
]

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

  const hasGoals = activeGoals.length > 0 || achievedGoals.length > 0

  return (
    <section className={cn('flex flex-col gap-6', 'px-4 py-4 md:p-8')}>
      {hasGoals && (
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Savings Goals</h1>
          <Button onClick={dialog.openCreate} className="gap-1">
            <PlusIcon className="h-4 w-4" />
            New Goal
          </Button>
        </header>
      )}

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
        <div className="min-h-content flex flex-1 items-center justify-center p-4 md:p-8">
          <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl',
                  'bg-primary/10 text-primary',
                )}
              >
                <Target className="h-6 w-6" />
              </div>
              <h1 className="text-foreground text-xl font-bold md:text-2xl">
                No savings goals yet
              </h1>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                Goals help you save for trips, an emergency fund, a down
                payment, or anything else worth planning for. Create one to
                start tracking deposits and progress.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {GOAL_FEATURES.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className={cn(
                      'flex flex-col items-start gap-2 rounded-xl border p-4 text-left',
                      'border-border bg-card',
                    )}
                  >
                    <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-foreground text-sm font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 rounded-full px-8"
              onClick={dialog.openCreate}
            >
              <PlusIcon className="h-4 w-4" />
              Create your first goal
            </Button>
          </div>
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
