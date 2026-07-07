import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const CourseForm = () => {
  const navigate = useNavigate()

  const [course, setCourse] = useState({
    name: "",
    par: "",
  })

  const [teeBox, setTeeBox] = useState({
    color: "",
  })

  const [holes, setHoles] = useState(
    Array.from({ length: 18 }, (_, index) => ({
      hole_number: index + 1,
      yardage: "",
      par: "",
      handicap: "",
    }))
  )

  const handleCourseChange = (event) => {
    setCourse({
      ...course,
      [event.target.name]: event.target.value,
    })
  }

  const handleTeeBoxChange = (event) => {
    setTeeBox({
      ...teeBox,
      [event.target.name]: event.target.value,
    })
  }

  const handleHoleChange = (index, event) => {
    const copyOfHoles = [...holes]

    copyOfHoles[index] = {
      ...copyOfHoles[index],
      [event.target.name]: event.target.value,
    }

    setHoles(copyOfHoles)
  }

  const handleSave = async (event) => {
    event.preventDefault()

    const completedHoles = holes.filter((hole) => {
      return hole.yardage !== "" || hole.par !== "" || hole.handicap !== ""
    })

    if (completedHoles.length !== 9 && completedHoles.length !== 18) {
      alert("Please enter either 9 holes or 18 holes.")
      return
    }

    const incompleteHole = completedHoles.find((hole) => {
      return hole.yardage === "" || hole.par === "" || hole.handicap === ""
    })

    if (incompleteHole) {
      alert("Each hole must include yardage, par, and handicap.")
      return
    }

    const courseResponse = await fetch("http://localhost:8000/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
      body: JSON.stringify({
        name: course.name,
        par: course.par,
      }),
    })

    if (!courseResponse.ok) {
      alert("Unable to create course.")
      return
    }

    const newCourse = await courseResponse.json()

    const totalYardage = completedHoles.reduce(
      (total, hole) => total + Number(hole.yardage || 0),
      0
    )

    const teeBoxResponse = await fetch("http://localhost:8000/tee_boxes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
      body: JSON.stringify({
        course_id: newCourse.id,
        color: teeBox.color,
        total_yardage: totalYardage,
      }),
    })

    if (!teeBoxResponse.ok) {
      alert("Course created, but unable to create tee box.")
      return
    }

    const newTeeBox = await teeBoxResponse.json()

    for (const hole of completedHoles) {
      await fetch("http://localhost:8000/holes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
        },
        body: JSON.stringify({
          tee_box_id: newTeeBox.id,
          hole_number: hole.hole_number,
          yardage: hole.yardage,
          par: hole.par,
          handicap: hole.handicap,
        }),
      })
    }

    navigate(`/courses/${newCourse.id}`)
  }

  return (
    <div className="course-form-container">
      <h2>Add Course</h2>

      <form onSubmit={handleSave}>
        <input
          name="name"
          placeholder="Course Name"
          value={course.name}
          onChange={handleCourseChange}
          required
        />

        <br />

        <input
          name="par"
          type="number"
          placeholder="Course Par"
          value={course.par}
          onChange={handleCourseChange}
          required
        />

        <br />

        <input
          name="color"
          placeholder="Tee Box Color"
          value={teeBox.color}
          onChange={handleTeeBoxChange}
          required
        />

        <h3>Hole Information</h3>

        <p>Enter either 9 holes or 18 holes.</p>

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
            {holes.map((hole, index) => (
              <tr key={hole.hole_number}>
                <td>{hole.hole_number}</td>

                <td>
                  <input
                    name="yardage"
                    type="number"
                    value={hole.yardage}
                    onChange={(event) => handleHoleChange(index, event)}
                  />
                </td>

                <td>
                  <input
                    name="par"
                    type="number"
                    value={hole.par}
                    onChange={(event) => handleHoleChange(index, event)}
                  />
                </td>

                <td>
                  <input
                    name="handicap"
                    type="number"
                    value={hole.handicap}
                    onChange={(event) => handleHoleChange(index, event)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit">Save Course</button>
      </form>
    </div>
  )
}