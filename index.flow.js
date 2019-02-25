// @flow

import { useRef, useState } from "react";

export const useAsync = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    pending: false,
    error: void 0,
    data: void 0
  });
  const onStart = () => {
    isMounted.current &&
      setState(state => ({ ...state, pending: true, error: void 0 }));
  };
  const onSuccess = (data: any) => {
    isMounted.current &&
      setState(state => ({ ...state, pending: false, data }));
  };
  const onError = (error: Error) => {
    isMounted.current &&
      setState(state => ({ ...state, pending: false, error }));
  };
  const reset = () => {
    isMounted.current &&
      setState(state => ({ pending: false, error: void 0, data: void 0 }));
  };

  return { onStart, onSuccess, onError, reset, ...state };
};

export default useAsync;
