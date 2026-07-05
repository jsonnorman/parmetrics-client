import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export const LoginPage = ({ setCurrentUser }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLoginSubmit = async (event) => {
    event.preventDefault()

    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    const user = await response.json()

    if (user.valid) {
      localStorage.setItem("parmetrics_token", user.token)
      localStorage.setItem("parmetrics_user_id", user.id)

      setCurrentUser(user)
      navigate("/dashboard")
    } else {
      alert("Invalid login")
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <br />
        <button className="btn">Sign In</button>
      </form>
      <br />
      <p>
        Do not have an account?{" "}
        <Link to="/welcome/createaccount">Create one</Link>
      </p>
    </div>
  )
}