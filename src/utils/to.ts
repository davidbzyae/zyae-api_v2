/**
 * Utility function that formats an asynchronous promise call to an array.
 * @param promise The promise to be formatted.
 * @returns An array containing the resolved data as the first element, and the error as the second element.
 */
export const to = async <T>(
  promise: Promise<T>
): Promise<[T | null, any | null]> => {
  try {
    const data: T = await promise;
    return [data, null];
  } catch (err) {
    return [null, err];
  }
};
