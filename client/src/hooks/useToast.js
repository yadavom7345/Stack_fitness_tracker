import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = useCallback((message, duration = 3500) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, duration);
  }, []);

  return { toast, showToast };
}
