import { Link } from "react-router-dom"

export const WelcomePage = () => {
  return (
    <>
      <h2>Welcome to Par Metrics</h2>

      <p>
        Build your personal library of golf courses, manage tee boxes,
        and keep track of your favorite courses.
      </p>

      <br />
      <Link to="/welcome/login">Login</Link>
      <br />
      <Link to="/welcome/createaccount">Create Account</Link>
      
    </>
  )
}