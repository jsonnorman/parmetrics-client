import { Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"

export const App = () => {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <>
      <h1>Par Metrics</h1>
      <p>Your digital golf course library.</p>

      <Routes>
        <Route path="/welcome" element={<h2>Welcome Page</h2>} />
        <Route path="/welcome/login" element={<h2>Login Page</h2>} />
        <Route path="/welcome/createaccount" element={<h2>Create Account Page</h2>} />

        <Route
          path="/dashboard"
          element={currentUser ? <h2>Dashboard</h2> : <Navigate to="/welcome/login" />}
        />

        <Route
          path="/courses"
          element={currentUser ? <h2>Courses</h2> : <Navigate to="/welcome/login" />}
        />

        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
    </>
  )
}