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

import usePromise, { PromiseWrapper } from './usePromise'
import useIsomorphicEffect from './useIsomorphicEffect';
import useRefMounted from './useRefMounted';

export type AsyncFunction<T> = (mounted: PromiseWrapper) => Promise<T>;

export interface AsyncDefault<T> {
  state: 'default',
  value?: T,
}

export interface AsyncLoading {
  state: 'loading',
}

export interface AsyncSuccess<T> {
  state: 'success',
  value: T,
}

export interface AsyncFailure {
  state: 'failure',
  value: Error,
}

export type AsyncState<T> = AsyncDefault<T> | AsyncLoading | AsyncSuccess<T> | AsyncFailure;

/**
 * Hook that performs an asynchronous memoization,
 * creating a state representing the memoization
 * progress.
 * 
 * The asynchronous function receives a callback
 * which transforms a Promise into a
 * lifecycle-dependent Promise.
 *
 * @category Hooks
 * @param fn 
 * @param initialValue 
 * @typeparam T type of the value produced returned by the async function
 */
export default function useAsyncMemo<T>(fn: AsyncFunction<T>, initialValue?: T, deps?: React.DependencyList): AsyncState<T> {
  /**
   * Create the state
   */
  const [state, setState] = React.useState<AsyncState<T>>({
    state: 'default',
    value: initialValue,
  });

  /**
   * Track component lifecycle
   */
  const mounted = useRefMounted();

  /**
   * Lifecycle-dependent Promise wrapper
   */
  const isMounted = usePromise(deps);

  /**
   * Memoize function
   */
  const callback = React.useCallback(fn, deps || [{}]);

  /**
   * Run isomorphic effect
   */
  useIsomorphicEffect(() => {
    setState({ state: 'loading' });
    callback(isMounted).then(
      value => mounted.current && setState({ state: 'success', value }),
      value => mounted.current && setState({ state: 'failure', value }),
    );
  }, [ callback, isMounted ]);

  return state;
}