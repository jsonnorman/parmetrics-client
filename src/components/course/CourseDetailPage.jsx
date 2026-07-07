import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

export const CourseDetailPage = () => {
  const { courseId } = useParams()

  const [course, setCourse] = useState(null)
  const [teeBoxes, setTeeBoxes] = useState([])
  const [selectedTeeBoxId, setSelectedTeeBoxId] = useState("")
  const [holes, setHoles] = useState([])

  useEffect(() => {
    fetch(`http://localhost:8000/courses/${courseId}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCourse(data))

    fetch(`http://localhost:8000/tee_boxes?course=${courseId}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTeeBoxes(data)

        if (data.length > 0) {
          setSelectedTeeBoxId(data[0].id)
        }
      })
  }, [courseId])

  useEffect(() => {
    if (selectedTeeBoxId) {
      fetch(`http://localhost:8000/holes?tee_box=${selectedTeeBoxId}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setHoles(data))
    }
  }, [selectedTeeBoxId])

  if (!course) {
    return <p>Loading course...</p>
  }

  return (
    <div className="course-detail-container">
      <Link to="/courses">Back to Courses</Link>

      <h2>{course.name}</h2>
      <p>Par: {course.par}</p>

      <Link to={`/courses/${courseId}/add-tee-box`}>
        <button>Add Tee Box</button>
      </Link>

      <section>
        <h3>Tee Boxes</h3>

        {teeBoxes.length === 0 ? (
          <p>No tee boxes have been added for this course.</p>
        ) : (
          <>
            <select
              value={selectedTeeBoxId}
              onChange={(event) => setSelectedTeeBoxId(event.target.value)}
            >
              {teeBoxes.map((teeBox) => (
                <option key={teeBox.id} value={teeBox.id}>
                  {teeBox.color} - {teeBox.total_yardage} yards
                </option>
              ))}
            </select>

            <h3>Scorecard</h3>

            {holes.length === 0 ? (
              <p>No holes have been added for this tee box.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Hole</th>
                    <th>Yardage</th>
                    <th>Par</th>
                    <th>Handicap</th>
                  </tr>
                </thead>

                <tbody>
                  {holes.map((hole) => (
                    <tr key={hole.id}>
                      <td>{hole.hole_number}</td>
                      <td>{hole.yardage}</td>
                      <td>{hole.par}</td>
                      <td>{hole.handicap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </section>
    </div>
  )
}