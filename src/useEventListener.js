import { useState, useEffect, MutableRefObject } from 'react';

const register = (reference, eventName, setState) => {
  if (reference && typeof reference === 'object' && typeof reference.addEventListener === 'function') {
    reference.addEventListener(eventName, setState);
    return () => {
      if (typeof reference.removeEventListener === 'function') {
        reference.removeEventListener(eventName, setState);
      }
    };
  }
  return () => {};
};

export default (reference, eventName) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (reference instanceof MutableRefObject) {
      return register(reference.current, eventName, setState);
    }
    return register(reference, eventName, setState);
  }, [reference, eventName]);

  return state;
};
