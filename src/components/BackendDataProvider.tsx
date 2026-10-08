'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function BackendDataProvider({ children }: { children: React.ReactNode }) {
  const loadBackendData = useAppStore((state) => state.loadBackendData);
  const hydrateDeviceAccent = useAppStore((state) => state.hydrateDeviceAccent);
  const hydrateLinkedTools = useAppStore((state) => state.hydrateLinkedTools);

  useEffect(() => {
    hydrateDeviceAccent();
    hydrateLinkedTools();
    loadBackendData();
  }, [hydrateDeviceAccent, hydrateLinkedTools, loadBackendData]);

  return children;
}
