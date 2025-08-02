// composables/useToast.ts
import { v4 as uuid } from 'uuid'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  timeout?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const addToast = (message: string, type: ToastType = 'info', timeout = 3000) => {
    const id = uuid()
    toasts.value.push({ id, message, type, timeout })

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, timeout)
  }

  return {
    toasts,
    show: addToast,
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
    warning: (msg: string) => addToast(msg, 'warning'),
  }
}
