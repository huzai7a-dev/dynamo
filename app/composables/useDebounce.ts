export const useDebounce =(valueRef, delay: number) => {
    const debounced = ref(valueRef.value)
    let timeout: NodeJS.Timeout
    watch(valueRef, (newVal) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        debounced.value = newVal
      }, delay)
    }, { deep: true }) // deep is needed for objects
    return debounced
  }