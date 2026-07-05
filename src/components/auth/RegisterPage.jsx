import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export const RegisterPage = ({ setCurrentUser }) => {
  const navigate = useNavigate()

  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  })

  const handleFieldChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    })
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()

    const response = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    })

    const newUser = await response.json()

    localStorage.setItem("parmetrics_token", newUser.token)
    localStorage.setItem("parmetrics_user_id", newUser.id)

    setCurrentUser(newUser)
    navigate("/dashboard")
  }

  return (
    <div className="register-container">
      <h2>Create Account</h2>

      <form onSubmit={handleRegisterSubmit}>
        <input name="first_name" placeholder="First Name" onChange={handleFieldChange} required />
        <br />
        <input name="last_name" placeholder="Last Name" onChange={handleFieldChange} required />
        <br />
        <input name="username" placeholder="Username" onChange={handleFieldChange} required />
        <br />
        <input name="email" placeholder="Email" onChange={handleFieldChange} required />
        <br />
        <input name="password" type="password" placeholder="Password" onChange={handleFieldChange} required />
        <br />
        <button className="btn">Create Account</button>
      </form>
      <br />

      <p>
        Already have an account?{" "}
        <Link to="/welcome/login">Login</Link>
      </p>

    </div>
  )
}