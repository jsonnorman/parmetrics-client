import { useEffect, useState } from "react"

export const FavoriteButton = ({ courseId }) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteId, setFavoriteId] = useState(null)

  useEffect(() => {
    fetch("http://localhost:8000/favorites", {
      headers: {
        Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
      },
    })
      .then((response) => response.json())
      .then((favorites) => {
        const matchingFavorite = favorites.find(
          (favorite) => favorite.course.id === courseId
        )

        if (matchingFavorite) {
          setIsFavorited(true)
          setFavoriteId(matchingFavorite.id)
        }
      })
  }, [courseId])

  const handleFavoriteClick = async () => {
    if (isFavorited) {
      const response = await fetch(
        `http://localhost:8000/favorites/${favoriteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
          },
        }
      )

      if (response.ok) {
        setIsFavorited(false)
        setFavoriteId(null)
      }
    } else {
      const response = await fetch("http://localhost:8000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("parmetrics_token")}`,
        },
        body: JSON.stringify({
          course_id: courseId,
        }),
      })

      if (response.ok) {
        const newFavorite = await response.json()
        setIsFavorited(true)
        setFavoriteId(newFavorite.id)
      }
    }
  }

  return (
    <button className="favorite-btn" onClick={handleFavoriteClick}>
      {isFavorited ? "Unfavorite" : "Favorite"}
    </button>
  )
}