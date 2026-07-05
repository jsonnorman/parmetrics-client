import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FavoriteButton } from "./FavoriteButton"

export const CourseListPage = () => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    fetch("http://localhost:8000/courses", {
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCourses(data))
  }, [])

  return (
    <div className="courses-container">
      <h2>Courses</h2>

      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        courses.map((course) => (
          <div className="course-card" key={course.id}>
            <div className="course-title-row">
              <Link to={`/courses/${course.id}`}>
                <h3>{course.name}</h3>
              </Link>

              <FavoriteButton courseId={course.id} />
            </div>

            <p className="course-par">
              Par: {course.par}
            </p>
          </div>
        ))
      )}
    </div>
  )
}