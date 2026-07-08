import { Link, useNavigate } from "react-router-dom"

export const NavigationBar = ({ handleLogout }) => {
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    localStorage.removeItem("parmetrics_token")
    localStorage.removeItem("parmetrics_user_id")
    handleLogout()
    navigate("/welcome/login")
  }

  return (
    <nav className="navbar">
      <div className="nav-menu">
        <Link to="/dashboard">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/courses/add">Create Course</Link>
      </div>

      <h2 className="nav-logo">Par Metrics</h2>

      <div className="nav-profile">
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogoutClick} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  )
}