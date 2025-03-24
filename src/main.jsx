import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import TsOrdersApp from './TsOrdersApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TsOrdersApp />
  </StrictMode>,
)
