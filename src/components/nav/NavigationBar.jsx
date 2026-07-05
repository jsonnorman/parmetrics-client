import { NavLink, useNavigate } from "react-router-dom";

export const NavigationBar = ({ handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("parmetrics_token");
    localStorage.removeItem("parmetrics_user_id");

    handleLogout();
    navigate("/welcome/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Par Metrics</h2>

      <div className="nav-links">
        <NavLink to="/dashboard">Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/profile">Profile</NavLink>

        <button
          onClick={handleLogoutClick}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};