import { useState, useEffect, MutableRefObject } from 'react';
import Hammer from 'hammerjs';

const register = (ref, event, options, setState) => {
  if (ref instanceof HTMLElement) {
    const instance = new Hammer(ref, options);
    instance.on(event, setState);
    return () => {
      instance.off(event, setState);
    };
  }
  return () => {};
};

export default (reference, event, options) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (reference instanceof MutableRefObject) {
      return register(reference.current, event, options, setState);
    }
    return register(reference, event, options, setState);
  }, [reference, event]);

  return state;
};
