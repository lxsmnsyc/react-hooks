import { useState } from 'react';

export default (initialValue) => {
  const [state, setState] = useState(initialValue);

  return [state, () => setState(!state)];
};
