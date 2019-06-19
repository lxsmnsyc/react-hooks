import { useState, useLayoutEffect } from 'react';

export default (interval, duration, delay) => {
  const [state, setState] = useState({ elapsed: 0, finished: false });

  useLayoutEffect(() => {
    let interval;

    const onFrame = (dt) => {
      setState({
        delta: dt,
        elapsed: state.elapsed + dt,
        finished: false,
      });
    };

    let durationTimer;
    const onDuration = () => {
      durationTimer = setTimeout(() => {
        clearInterval(interval);
        setState({
          elapsed: state.elapsed,
          finished: true,
        });
      }, duration);
      interval = setInterval(() => {
        setState(() => {
          elapsed: 
          finished: false,
        });
      }, interval);
    };

    const delayTimer = setTimeout(onDuration, delay);

    return () => {
      clearTimeout(durationTimer);
      clearTimeout(delayTimer);
      clearInterval(interval);
    };
  }, [interval, duration, delay]);

  return state;
};
