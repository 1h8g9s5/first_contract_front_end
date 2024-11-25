import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

const manifestUrl = "https://raw.githubusercontent.com/1h8g9s5/my-twa/refs/heads/main/public/tonconnect-manifest.json"

createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
