import { ChangeEvent } from "react"
import { useAuthContext } from "../Auth/AuthContext"
import { IUpload } from "../../types"

const Upload = (props: IUpload) => {
  const { uploadRef, onFinish } = props
  const { getSaltFromFile } = useAuthContext()

  const getSalt = async (e: ChangeEvent<HTMLInputElement>) => {
    if (await getSaltFromFile(e)) {
      if (onFinish) onFinish()
    }
  }

  return (
    <input type="file" ref={uploadRef} onChange={getSalt} className="upload" />
  )
}

export default Upload
