/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2019
 */
import * as React from 'react';
import { useIsomorphicEffect } from './useIsomorphicEffect';
import useOnUnmount from './useOnUnmount';

type Cleanup = (() => void | undefined) | void;

export default function useThrottledEffect(callback: React.EffectCallback, timeout: number = 150, deps?: React.DependencyList) {
  /**
   * Holds the current duration
   */
  const duration = React.useRef(timeout);

  /**
   * Holds the timer reference
   */
  const timer = React.useRef<number | undefined>();

  /**
   * Holds the cleanup callback
   */
  const cleanup = React.useRef<Cleanup>();

  /**
   * Perform cleanups whenever timeout changes.
   */
  useIsomorphicEffect(() => {
    if (cleanup.current) {
      cleanup.current();
      cleanup.current = undefined;
    }
    if (timer.current) {
      clearTimeout(timer.current);
    }
    duration.current = timeout;
  }, [ timeout ]);

  /**
   * Run throttled side-effect
   */
  useIsomorphicEffect(() => {
    /**
     * Check if timeout is not running
     */
    if (!timer.current) {
      /**
       * If there is a cleanup, call it
       */
      if (cleanup.current) {
        cleanup.current();
        cleanup.current = undefined;
      }

      /**
       * Setup timeout
       */
      timer.current = window.setTimeout(() => {
        timer.current = undefined;
      }, duration.current);

      /**
       * Execute effect and get cleanup
       */
      cleanup.current = callback();
    }
  }, deps);

  /**
   * Perform cleanup on unmount
   */
  useOnUnmount(() => {
    if (cleanup.current) {
      cleanup.current();
    }
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
  });
}