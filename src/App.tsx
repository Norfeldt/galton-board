import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Index from './pages/Index'

const queryClient = new QueryClient()

const App = () => {
  // Override any external styles that might limit body width
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        max-width: none !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Index />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App
