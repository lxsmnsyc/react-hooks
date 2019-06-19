import { useState, useEffect } from 'react';

const useEvent = (ws, eventName) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (ws instanceof WebSocket) {
      const listener = (event) => {
        setState(event);
      };
      ws.addEventListener(eventName, listener);

      return () => {
        ws.removeEventListener(eventName, listener);
      };
    }
    return () => {};
  }, [ws, eventName]);

  return state;
};

export default {
  onEvent: useEvent,
  onOpen: ws => useEvent(ws, 'open'),
  onClose: ws => useEvent(ws, 'close'),
  onError: ws => useEvent(ws, 'error'),
  onMessage: ws => useEvent(ws, 'message'),
};
