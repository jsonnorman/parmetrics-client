import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

export const CourseDetailPage = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState({})

  useEffect(() => {
    fetch(`http://localhost:8000/courses/${courseId}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCourse(data))
  }, [courseId])

  return (
    <div className="course-detail-container">
      <Link to="/courses">Back to Courses</Link>

      <h2>{course.name}</h2>
      <p>Par: {course.par}</p>
    </div>
  )
}