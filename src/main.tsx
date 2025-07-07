import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { addWebPClass } from './utils/webp-detect'

// Detect WebP support for optimized image loading
addWebPClass();

createRoot(document.getElementById("root")!).render(<App />);
