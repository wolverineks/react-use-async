import * as React from 'react'

const useIsMounted = () => {
  const isMounted = React.useRef(true)
  React.useEffect(
    () => () => {
      isMounted.current = false
    },
    [],
  )

  return isMounted
}

interface State {
  pending: boolean
  error?: Error
  data?: any
}

type Action = { type: 'START' } | { type: 'SUCCESS'; data: any } | { type: 'ERROR'; error: Error } | { type: 'RESET' }

const initialState: State = {
  pending: false,
  error: undefined,
  data: undefined,
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'START': {
      return { ...state, pending: true, data: undefined, error: undefined }
    }
    case 'SUCCESS': {
      return { ...state, pending: false, data: action.data }
    }
    case 'ERROR': {
      return { ...state, pending: false, error: action.error }
    }
    case 'RESET': {
      return initialState
    }

    default: {
      throw new Error('Invalid action')
    }
  }
}

export const useAsync = <Data>(
  initial: Partial<State> = {},
): {
  data?: Data
  error?: Error
  onError: (error: Error) => void
  onStart: () => void
  onSuccess: (data: Data) => void
  pending: boolean
  reset: () => void
} => {
  const isMounted = useIsMounted()
  const [{ data, error, pending }, dispatch] = React.useReducer(reducer, { ...initialState, ...initial })

  const onStart = React.useCallback(() => {
    if (pending) {
      dispatch({ type: 'ERROR', error: new PendingActionError() })
      return
    }
    isMounted.current && dispatch({ type: 'START' })
  }, [isMounted, pending])

  const onSuccess = React.useCallback((data: Data) => isMounted.current && dispatch({ type: 'SUCCESS', data }), [
    isMounted,
  ])

  const onError = React.useCallback((error: Error) => isMounted.current && dispatch({ type: 'ERROR', error }), [
    isMounted,
  ])

  const reset = React.useCallback(() => {
    if (pending) {
      dispatch({ type: 'ERROR', error: new PendingActionError() })
      return
    }
    isMounted.current && dispatch({ type: 'RESET' })
  }, [isMounted, pending])

  return { onStart, onSuccess, onError, reset, data, error, pending }
}

export default useAsync

class PendingActionError extends Error {
  message = 'Multiple async actions. Use "pending" to prevent this.'
}
