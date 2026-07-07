import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const DashboardPage = () => {
  const [myCourses, setMyCourses] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    fetch("http://localhost:8000/courses?created_by_me=true", {
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMyCourses(data))

    fetch("http://localhost:8000/favorites", {
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFavorites(data))
  }, [])

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <Link to="/courses/add"> <button>Add Course</button> </Link>
      <br />
      
      <section>
        <h3>My Courses</h3>

        {myCourses.length === 0 ? (
          <p>No courses created yet.</p>
        ) : (
          myCourses.map((course) => (
            <div className="dashboard-course-card" key={course.id}>
              <h4>
                <Link to={`/courses/${course.id}`}>
                  {course.name}
                </Link>
              </h4>

              <p>Par: {course.par}</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h3>Favorite Courses</h3>

        {favorites.length === 0 ? (
          <p>No favorite courses yet.</p>
        ) : (
          favorites.map((favorite) => (
            <div className="dashboard-course-card" key={favorite.id}>
              <h4>
                <Link to={`/courses/${favorite.course.id}`}>
                  {favorite.course.name}
                </Link>
              </h4>

              <p>Par: {favorite.course.par}</p>
            </div>
          ))
        )}
      </section>
    </div>
  )
}