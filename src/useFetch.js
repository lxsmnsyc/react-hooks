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
import { useState, useEffect, useRef } from 'react';

export default (url, options, then) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(null);
  const [controller, setController] = useState(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);

    const ctrl = new AbortController();
    setController(ctrl);

    const fetchRequest = async () => {
      try {
        const response = await fetch(url, {
          ...options,
          signal: ctrl.signal,
        });

        if (mounted.current) {
          let result = response;
          if (then) {
            result = await then(response, null);
          }
          setValue(result);
          setLoading(false);
        }
      } catch (err) {
        if (mounted.current) {
          let result = err;
          if (then) {
            result = await then(err, null);
          }
          setError(result);
          setLoading(false);
        }
      }
    };

    fetchRequest();

    return () => {
      mounted.current = false;
      ctrl.abort();
    };
  }, [url]);

  return {
    loading, error, value, controller,
  };
};
