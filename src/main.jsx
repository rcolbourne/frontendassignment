import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InitialDisplay from "./InitialDisplay";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

function App()
{
  return(
    <div>
      <InitialDisplay /> 
    </div>
  )
}
