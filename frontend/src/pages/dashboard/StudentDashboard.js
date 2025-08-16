import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = `${process.env.REACT_APP_API_URL}/api/my_enrollments/`

export default function StudentDashboard() {
    const [enrollments, setEnrollments] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        (async function getEnrollments() {
            try {
                const res = await axios.get(baseUrl, { withCredentials: true })
                setEnrollments(res.data)
            }
            catch (e) {
                console.log("can't fetch enroolements", e.data)
            }
        })()
    }, [])

    function openCourse(courseId){
        navigate(`/learning/${courseId}/`)
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    return (
        <>
            <h1>
                Hi {storedUser?.username}
            </h1>
            {enrollments?.map((en) => (
                <div key={en.id} style={{marginBottom:"10px",border:"1px solid black", padding:"8px", maxWidth: "80%"}}>
                    {en.course_title} <br />
                    {en.progress_percent}% Completed <br />
                    <button onClick={() => openCourse(en.course)}>Open</button>
                </div>
            ))}
        </>
    )
}