import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import LastCall from './lastCall'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LastCall />
  </StrictMode>,
)
