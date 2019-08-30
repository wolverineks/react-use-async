import * as React from "react";

const useIsMounted = () => {
  const isMounted = React.useRef(false)
  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return () => isMounted.current
}

interface State {
  pending: boolean;
  error?: Error;
  data?: any;
}

type Action =
  | { type: "START" }
  | { type: "SUCCESS"; data: any }
  | { type: "ERROR"; error: Error }
  | { type: "RESET" };

const initialState: State = {
  pending: false,
  error: undefined,
  data: undefined,
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "START": {
      return { ...state, pending: true, data: undefined, error: undefined };
    }
    case "SUCCESS": {
      return { ...state, pending: false, data: action.data };
    }
    case "ERROR": {
      return { ...state, pending: false, error: action.error };
    }
    case "RESET": {
      return initialState;
    }

    default: {
      throw new Error("Invalid action");
    }
  }
};

export const useAsync = <Data>(): {
  data?: Data;
  error?: Error;
  onError: (error: Error) => void;
  onStart: () => void;
  onSuccess: (data: Data) => void;
  pending: boolean;
  reset: () => void;
} => {
  const isMounted = useIsMounted()
  const [{ data, error, pending }, dispatch] = React.useReducer(
    reducer,
    initialState,
  );

  const onStart = React.useCallback(() => {
    if (pending) throw new Error('Multiple async actions. Use "pending" to prevent this.')
    isMounted() && dispatch({ type: "START" })
  }, []);
  const onSuccess = React.useCallback(
    (data: Data) => isMounted() && dispatch({ type: "SUCCESS", data }),
    [],
  );
  const onError = React.useCallback(
    (error: Error) => isMounted() && dispatch({ type: "ERROR", error }),
    [],
  );
  const reset = React.useCallback(() => {
    if (pending) throw new Error('Multiple async actions. Use "pending" to prevent this.')
    isMounted() && dispatch({ type: "RESET" })
  }, []);

  return { onStart, onSuccess, onError, reset, data, error, pending };
};

export default useAsync