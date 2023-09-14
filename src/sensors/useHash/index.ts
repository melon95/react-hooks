import { useCallback, useEffect, useState } from 'react';

function useHash() {
  const [hashValue, setHashValue] = useState(window.location.hash);
  useEffect(() => {
    const handleHashChange = () => {
      setHashValue(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setHash = useCallback((newHash: string) => {
    window.location.hash = newHash;
    setHashValue(newHash)
  }, [])

  return [hashValue, setHash] as const;
}

export default useHash