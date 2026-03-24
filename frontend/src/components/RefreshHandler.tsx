'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RefreshHandler() {
  const router = useRouter();

  useEffect(() => {
    // Define um intervalo de 60 segundos (60000 ms)
    const interval = setInterval(() => {
      router.refresh(); // Isso força o Next.js a rodar o fetch no servidor novamente
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  return null; // Componente invisível
}