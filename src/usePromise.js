import { useState } from 'react';
import useRefMounted from './useRefMounted';

export default (promise) => {
  const [state, setState] = useState({ loading: false });

  const mounted = useRefMounted();

  useCallback(() => {
    setState({ loading: true });

    return promise.then(
      (value) => {
        if (mounted.current) {
          setState({ value, loading: false});
        }
      },
      (error) => {
        if (mounted.current) {
          setState({ error, loading: false});
        }
      },
    );
  }, []);

  return state;
};