import { Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"

import { WelcomePage } from "./components/welcome/WelcomePage"
import { LoginPage } from "./components/auth/LoginPage"
import { RegisterPage } from "./components/auth/RegisterPage"
import { NavigationBar } from "./components/nav/NavigationBar"
import { DashboardPage } from "./components/dashboard/DashboardPage"
import { CourseListPage } from "./components/course/CourseListPage"
import { CourseDetailPage } from "./components/course/CourseDetailPage"
import { TeeBoxForm } from "./components/course/TeeBoxForm"
import { CourseForm } from "./components/course/CourseForm"
import { ProfilePage } from "./components/profile/ProfilePage"

export const App = () => {
  const [currentUser, setCurrentUser] = useState( localStorage.getItem("parmetrics_token") ? {} : null )

  return (
    <>

      {currentUser && ( <NavigationBar handleLogout={() => setCurrentUser(null)} /> )}

      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/welcome/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path="/welcome/createaccount" element={<RegisterPage setCurrentUser={setCurrentUser} />} />

        <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/welcome/login" />} />
        <Route path="/dashboard" element={currentUser ? <DashboardPage /> : <Navigate to="/welcome/login" />} />
        <Route path="/courses" element={currentUser ? <CourseListPage /> : <Navigate to="/welcome/login" />} />
        <Route path="/courses/:courseId" element={currentUser ? <CourseDetailPage /> : <Navigate to="/welcome/login" />} />
        <Route path="/courses/:courseId/add-tee-box" element={currentUser ? <TeeBoxForm /> : <Navigate to="/welcome/login" />} />
        <Route path="/courses/:courseId/tee-boxes/:teeBoxId/edit" element={currentUser ? <TeeBoxForm /> : <Navigate to="/welcome/login" />} />
        <Route path="/courses/add" element={currentUser ? <CourseForm /> : <Navigate to="/welcome/login" />} />
        <Route path="*" element={<Navigate to="/welcome" />} />

      </Routes>
    </>
  )
}