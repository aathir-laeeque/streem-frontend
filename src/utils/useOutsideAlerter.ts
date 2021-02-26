import { noop } from 'lodash';
import { useEffect } from 'react';

export default function useOutsideAlerter(
  ref: React.RefObject<HTMLDivElement>,
  onOutside = noop,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event?.target as Node)) {
        onOutside();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
