'use client'

import { useTransition } from 'react'

interface DeleteButtonProps {
  action: () => Promise<void>
  label?: string
}

export default function DeleteButton({ action, label = 'Delete' }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      className="font-sans text-xs text-dp-red hover:underline disabled:opacity-50"
      onClick={() => {
        if (!confirm('Delete this article? This cannot be undone.')) return
        startTransition(async () => {
          await action()
        })
      }}
    >
      {isPending ? 'Deleting...' : label}
    </button>
  )
}
