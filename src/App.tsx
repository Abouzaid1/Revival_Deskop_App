import { useEffect, useState } from 'react'
import './hide-scrollbar.css'
import Signin from './pages/Signin'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Dashboard/Home'
import ProtectedRoute from './utils/ProtectedRoute'
import TitleBar from './components/layout/TitleBar'
import Invoices from './components/screen/Invoices'
import Companies from './components/screen/Companies'
import InvoiceDetails from './components/screen/InvoiceDetails'
import auth from './apis/auth'
import Audit from './components/screen/Audit'


function App() {
  useEffect(() => {
    document.title = 'Revival_Me';
  }, []);
  const [signedIn, setSignedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setSignedIn(auth.checkSignIn())
      setLoading(false)
    }, 300)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Height of TitleBar (adjust if TitleBar height changes)
  const TITLEBAR_HEIGHT = 48; // px
  return (
    <div

      className="w-full flex flex-col min-h-screen bg-white select-none" style={{ userSelect: 'none' }}>
      <div dir="ltr" className="fixed top-0 left-0 w-full z-50" style={{ height: TITLEBAR_HEIGHT }}>
        <TitleBar />
      </div>
      <div dir="rtl" className="overflow-auto" style={{ marginTop: TITLEBAR_HEIGHT, height: `calc(100vh - ${TITLEBAR_HEIGHT}px)` }}>
        <Routes>
          {/* Sign In route */}
          <Route
            path="/signin"
            element={
              signedIn ? <Navigate to="/" replace /> : <Signin />
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute signedIn={signedIn}>
                {/* if company not created, redirect */}
                <Home />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Invoices />} />
            <Route path="/company-creation" element={<Companies />} />
            <Route path="/audit" element={<Audit />} />
          </Route>
          <Route path="/invoice/:id" element={<InvoiceDetails />} />

          {/* Company creation route */}

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
