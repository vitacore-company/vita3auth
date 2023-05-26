import { useEffect, useState } from "react"
import { IEllipse } from "../../types"

const Ellipse = ({ className }: IEllipse) => {
  const [position, setPosition] = useState({})

  useEffect(() => {
    const setRandomCoords = () => {
      setPosition({
        left: Math.floor((Math.random() * window.screen.width) / 2),
        top: Math.floor((Math.random() * window.screen.height) / 2),
      })
    }

    setRandomCoords()

    const interval = setInterval(() => {
      setRandomCoords()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div className={className} style={position} />
}

export default Ellipse
