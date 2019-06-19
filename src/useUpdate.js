import { useState } from 'react';
import useToggle from './useToggle';

export default () => {
  const [, toggler] = useToggle();
  return toggler;
};