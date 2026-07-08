import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

export const CourseDetailPage = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [teeBoxes, setTeeBoxes] = useState([])
  const [selectedTeeBoxId, setSelectedTeeBoxId] = useState("")
  const [holes, setHoles] = useState([])

  const [isEditingCourse, setIsEditingCourse] = useState(false)
  const [editedCourse, setEditedCourse] = useState({
    name: "",
    par: "",
  })

  const getTeeBoxes = () => {
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
        } else {
          setSelectedTeeBoxId("")
          setHoles([])
        }
      })
  }

  useEffect(() => {
    fetch(`http://localhost:8000/courses/${courseId}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCourse(data))

    getTeeBoxes()
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

  const handleEditedCourseChange = (event) => {
    setEditedCourse({
      ...editedCourse,
      [event.target.name]: event.target.value,
    })
  }

  const beginEditCourse = () => {
    setEditedCourse({
      name: course.name,
      par: course.par,
    })

    setIsEditingCourse(true)
  }

  const cancelEditCourse = () => {
    setIsEditingCourse(false)
    setEditedCourse({
      name: "",
      par: "",
    })
  }

  const saveEditedCourse = async () => {
    const response = await fetch(`http://localhost:8000/courses/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
      body: JSON.stringify({
        name: editedCourse.name,
        par: editedCourse.par,
      }),
    })

    if (!response.ok) {
      alert("Error updating course.")
      return
    }

    setCourse({
      ...course,
      name: editedCourse.name,
      par: editedCourse.par,
    })

    setIsEditingCourse(false)
  }

  const deleteCourse = async () => {
    const response = await fetch(`http://localhost:8000/courses/${courseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })

    if (!response.ok) {
      alert("Error deleting course.")
      return
    }

    navigate("/courses")
  }

  const deleteTeeBox = async () => {
    const response = await fetch(
      `http://localhost:8000/tee_boxes/${selectedTeeBoxId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
        },
      }
    )

    if (!response.ok) {
      alert("Error deleting tee box.")
      return
    }

    getTeeBoxes()
  }

  if (!course) {
    return <p>Loading course...</p>
  }

  const isOwner =
    course.user === Number(localStorage.getItem("parmetrics_user_id"))

  const selectedTeeBox = teeBoxes.find(
    (teeBox) => teeBox.id === Number(selectedTeeBoxId)
  )

  const totalPar = holes.reduce((total, hole) => {
    return total + Number(hole.par)
  }, 0)

  const totalYardage = holes.reduce((total, hole) => {
    return total + Number(hole.yardage)
  }, 0)

  return (
    <div className="course-detail-container">
      <Link to="/courses">Back to Courses</Link>

      {isEditingCourse ? (
        <div>
          <h2>Edit Course</h2>

          <input
            name="name"
            value={editedCourse.name}
            onChange={handleEditedCourseChange}
          />

          <br />

          <input
            name="par"
            type="number"
            value={editedCourse.par}
            onChange={handleEditedCourseChange}
          />

          <br />

          <button onClick={saveEditedCourse}>Save</button>
          <button onClick={cancelEditCourse}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2>{course.name}</h2>
          <p>Par: {course.par}</p>

          {isOwner && (
            <>
              <button onClick={beginEditCourse}>Edit Course</button>
              <button onClick={deleteCourse}>Delete Course</button>
            </>
          )}
        </div>
      )}

      <br />

      {isOwner && (
        <Link to={`/courses/${courseId}/add-tee-box`}>
          <button>Add Tee Box</button>
        </Link>
      )}

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

            <br />

            {isOwner && (
              <>
                <Link
                  to={`/courses/${courseId}/tee-boxes/${selectedTeeBoxId}/edit`}
                >
                  <button>Edit Tee Box</button>
                </Link>

                <button onClick={deleteTeeBox}>Delete Tee Box</button>
              </>
            )}

            <h3>Scorecard</h3>

            {holes.length === 0 ? (
              <p>No holes have been added for this tee box.</p>
            ) : (
              <table className="scorecard">
                <tbody>
                  <tr>
                    <th>Hole</th>
                    {holes.map((hole) => (
                      <td key={hole.id}>{hole.hole_number}</td>
                    ))}
                    <th>Total</th>
                  </tr>

                  <tr>
                    <th>Yardage</th>
                    {holes.map((hole) => (
                      <td key={hole.id}>{hole.yardage}</td>
                    ))}
                    <td>{selectedTeeBox?.total_yardage || totalYardage}</td>
                  </tr>

                  <tr>
                    <th>Par</th>
                    {holes.map((hole) => (
                      <td key={hole.id}>{hole.par}</td>
                    ))}
                    <td>{totalPar}</td>
                  </tr>

                  <tr>
                    <th>Handicap</th>
                    {holes.map((hole) => (
                      <td key={hole.id}>{hole.handicap}</td>
                    ))}
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        )}
      </section>
    </div>
  )
}