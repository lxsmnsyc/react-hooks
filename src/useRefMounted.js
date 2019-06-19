import { useRef } from 'react';

export default () => {
  const state = useRef(false);

  useEffect(() => {
    state.current = true;
    return () => {
      state.current = false;
    };
  });

  return state;
};