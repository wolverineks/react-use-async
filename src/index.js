// @flow

import { useEffect, useRef, useState } from 'react'

const useIsMounted = () => {
  const isMounted = useRef(false)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return () => isMounted.current
}

const initialState = {
  pending: false,
  error: void 0,
  data: void 0
}

export const useAsync = <Data>(): {
  data: ?Data,
  error: ?Error,
  onError: (error: Error) => void,
  onStart: () => void,
  onSuccess: (data: Data) => void,
  pending: boolean,
  reset: () => void
} => {
  const isMounted = useIsMounted()
  const [{ data, error, pending }, setState] = useState(initialState)

  const onStart = () => {
    if (pending) throw new Error('Multiple async actions. Use "pending" to prevent this.')
    isMounted() &&
      setState({
        data: void 0,
        error: void 0,
        pending: true
      })
  }
  const onSuccess = data => {
    isMounted() &&
      setState({
        data,
        error: void 0,
        pending: false
      })
  }
  const onError = error => {
    isMounted() &&
      setState({
        error,
        data: void 0,
        pending: false
      })
  }
  const reset = () => {
    if (pending) throw new Error('Multiple async actions. Use "pending" to prevent this.')
    isMounted() && setState(initialState)
  }

  return { onStart, onSuccess, onError, reset, data, error, pending }
}
