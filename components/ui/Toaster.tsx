'use client'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  // Expose globally
  useEffect(() => {
    (window as any).__bamaliToast = addToast
  }, [addToast])

  const icons = { success: CheckCircle, error: AlertCircle, info: Info }
  const colors = {
    success: 'bg-emerald-600 border-emerald-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-primary-700 border-primary-600',
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map(toast => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3.5 rounded-2xl text-white shadow-xl border',
              'animate-fade-up',
              colors[toast.type]
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="hover:opacity-70 transition-opacity">
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

// Helper to use outside React (from API routes etc.)
export function showToast(message: string, type: ToastType = 'success') {
  if (typeof window !== 'undefined' && (window as any).__bamaliToast) {
    (window as any).__bamaliToast(message, type)
  }
}
