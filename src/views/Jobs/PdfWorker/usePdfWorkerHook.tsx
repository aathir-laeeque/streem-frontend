import { useEffect, useRef } from 'react';
import { pdfWorker } from './worker';

function usePdfWorkerHook({
  keysToCheck,
  loadingKeysToCheck,
  progressCallback,
  ...rest
}: {
  keysToCheck: string[];
  loadingKeysToCheck?: any;
  [key: string]: any;
}) {
  const creationStarted = useRef(false);

  // LoadingKeysToCheck is an object with keys as the keys of the loading states

  useEffect(() => {
    if (!creationStarted.current) {
      const areAllKeysPresent = keysToCheck.every((key) => rest[key] !== undefined);
      const allLoadingsAreFalse = loadingKeysToCheck
        ? Object.values(loadingKeysToCheck).every((isLoading) => !isLoading)
        : true;

      if (areAllKeysPresent && allLoadingsAreFalse) {
        creationStarted.current = true;
        pdfWorker(rest, progressCallback);
      }
    }
  }, [rest]);

  return null;
}

export default usePdfWorkerHook;
