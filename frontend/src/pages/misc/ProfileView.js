import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const baseURL = `${process.env.REACT_APP_API_URL}/api/users`

export default function ProfileView() {
    const { username } = useParams()
    const [userData, setUserData] = useState()
    useEffect(() => {
        (async () => {
            const res = await axios.get(`${baseURL}/${username}/`, { withCredentials: true })
            setUserData(res.data)
        })()
    }, [username])

    return (
        <>
            <div>{userData && <>
                <h2>{userData.username}</h2>
                <img src={`/avatar/${userData?.avatar}.png`} alt={`Avatar ${userData?.avatar}`} />
                <p>Bio: {userData.bio}</p>
            </>
                }
            </div>
        </>
    )
}