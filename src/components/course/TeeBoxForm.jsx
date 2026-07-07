import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const TeeBoxForm = () => {
  const navigate = useNavigate()
  const { courseId, teeBoxId } = useParams()

  const isEditing = teeBoxId !== undefined

  const [teeBox, setTeeBox] = useState({
    color: "",
  })

  const [holes, setHoles] = useState(
    Array.from({ length: 18 }, (_, index) => ({
      id: null,
      hole_number: index + 1,
      yardage: "",
      par: "",
      handicap: "",
    }))
  )

  useEffect(() => {
    if (isEditing) {
      fetch(`http://localhost:8000/tee_boxes/${teeBoxId}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setTeeBox({
            color: data.color,
          })
        })

      fetch(`http://localhost:8000/holes?tee_box=${teeBoxId}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const holeRows = Array.from({ length: 18 }, (_, index) => {
            const existingHole = data.find(
              (hole) => hole.hole_number === index + 1
            )

            return existingHole || {
              id: null,
              hole_number: index + 1,
              yardage: "",
              par: "",
              handicap: "",
            }
          })

          setHoles(holeRows)
        })
    }
  }, [teeBoxId])

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

    const totalYardage = completedHoles.reduce(
      (total, hole) => total + Number(hole.yardage || 0),
      0
    )

    if (isEditing) {
      await fetch(`http://localhost:8000/tee_boxes/${teeBoxId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
        },
        body: JSON.stringify({
          course_id: courseId,
          color: teeBox.color,
          total_yardage: totalYardage,
        }),
      })

      for (const hole of completedHoles) {
        await fetch(`http://localhost:8000/holes/${hole.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
          },
          body: JSON.stringify({
            tee_box_id: teeBoxId,
            hole_number: hole.hole_number,
            yardage: hole.yardage,
            par: hole.par,
            handicap: hole.handicap,
          }),
        })
      }

      navigate(`/courses/${courseId}`)
    } else {
      const teeBoxResponse = await fetch("http://localhost:8000/tee_boxes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
        },
        body: JSON.stringify({
          course_id: courseId,
          color: teeBox.color,
          total_yardage: totalYardage,
        }),
      })

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

      navigate(`/courses/${courseId}`)
    }
  }

  return (
    <div className="tee-box-form-container">
      <h2>{isEditing ? "Edit Tee Box" : "Add Tee Box"}</h2>

      <form onSubmit={handleSave}>
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

        <button type="submit">
          {isEditing ? "Save Changes" : "Save Tee Box"}
        </button>
      </form>
    </div>
  )
}