import { useState, useLayoutEffect } from 'react';

export default (interval, duration, delay) => {
  const [state, setState] = useState({ elapsed: 0, finished: false });

  useLayoutEffect(() => {
    let timer;

    let durationTimer;
    const onDuration = () => {
      durationTimer = setTimeout(() => {
        clearInterval(timer);
        setState({
          elapsed: duration - state.elapsed,
          finished: true,
        });
      }, duration);
      timer = setInterval(() => {
        setState({
          elapsed: state.elapsed + interval,
          finished: false,
        });
      }, interval);
    };

    const delayTimer = setTimeout(onDuration, delay);

    return () => {
      clearTimeout(durationTimer);
      clearTimeout(delayTimer);
      clearInterval(timer);
    };
  }, [interval, duration, delay]);

  return state;
};
