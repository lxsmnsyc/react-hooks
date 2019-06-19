import { useState, useLayoutEffect } from 'react';

export default (duration, delay) => {
  const [state, setState] = useState({ delta: 0, elapsed: 0, finished: false });

  useLayoutEffect(() => {
    let raf;

    const onFrame = (dt) => {
      setState({
        delta: dt,
        elapsed: state.elapsed + dt,
        finished: false,
      });

      raf = requestAnimationFrame(onFrame);
    };

    let durationTimer;
    const onDuration = () => {
      durationTimer = setTimeout(() => {
        cancelAnimationFrame(raf);
        setState({
          delta: state.delta,
          elapsed: state.elapsed,
          finished: true,
        });
      }, duration);
      raf = requestAnimationFrame(onFrame);
    };

    const delayTimer = setTimeout(onDuration, delay);

    return () => {
      clearTimeout(durationTimer);
      clearTimeout(delayTimer);
      cancelAnimationFrame(raf);
    };
  });

  return state;
};