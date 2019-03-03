// @flow

import { useEffect, useRef, useState } from 'react'

const initialState = {
  pending: false,
  error: void 0,
  data: void 0
}

export const useAsync = (): {
  data: any,
  error: ?Error,
  onError: (error: Error) => void,
  onStart: () => void,
  onSuccess: (data: any) => void,
  pending: boolean
} => {
  const isMounted = useRef(false)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const [state, setState] = useState(initialState)
  const onStart = () => {
    isMounted.current && setState({ pending: true, error: void 0, data: void 0 })
  }
  const onSuccess = (data: any) => {
    isMounted.current && setState({ pending: false, error: void 0, data })
  }
  const onError = (error: Error) => {
    isMounted.current && setState({ pending: false, error, data: void 0 })
  }
  const reset = () => {
    isMounted.current && setState(initialState)
  }

  return { onStart, onSuccess, onError, reset, ...state }
}
