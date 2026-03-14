import { useCallback, useState } from 'react';
import { sha256Hex } from '../utils/pinHash';
import { PIN_HASH } from '../utils/env';

const STORAGE_KEY = 'duitkita_unlocked';

export function useAuth() {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [error, setError] = useState<string | null>(null);

  const unlock = useCallback(async (pin: string) => {
    if (pin.length !== 6) {
      setError('PIN harus 6 digit.');
      return false;
    }
    const hash = await sha256Hex(pin);
    if (hash === PIN_HASH) {
      setUnlocked(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      setError(null);
      return true;
    }
    setError('PIN salah.');
    return false;
  }, []);

  const lock = useCallback(() => {
    setUnlocked(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { unlocked, unlock, lock, error };
}

