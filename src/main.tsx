
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <>
    <meta
      httpEquiv="Content-Security-Policy"
      content="default-src 'self'; connect-src 'self' http://localhost:9090; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
    />
    <HashRouter>
      <App />
    </HashRouter>
  </>
)
