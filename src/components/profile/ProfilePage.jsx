import { useEffect, useState } from "react"

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetch("http://localhost:8000/profile", {
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProfile(data))
  }, [])

  if (!profile) {
    return <p>Loading profile...</p>
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <p>Name: {profile.first_name} {profile.last_name}</p>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
    </div>
  )
}