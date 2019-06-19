import { useState } from 'react';

export default (duration) => {
  const [state, setState] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setState(true), duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return state;
};