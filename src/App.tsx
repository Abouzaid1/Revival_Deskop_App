import { useEffect, useState } from 'react'
import Signin from './pages/Signin'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Dashboard/Home'
import ProtectedRoute from './utils/ProtectedRoute'
import TitleBar from './components/layout/TitleBar'
import Invoices from './components/screen/Invoices'
import Companies from './components/screen/Companies'
import InvoiceDetails from './components/screen/InvoiceDetails'
import auth from './apis/auth'


function App() {
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
      <div className="flex items-center justify-center h-full w-screen bg-white">
        <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="h-[90%] w-full flex flex-col">
      <div dir="ltr" className="sticky top-0 z-50">
        <TitleBar />
      </div>
      <div dir="rtl" className="flex-1 overflow-auto">
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
