import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './StudentDashboard.css';

const baseUrl = `${process.env.REACT_APP_API_URL}/api/my_enrollments/`;

export default function StudentDashboard() {
    const [enrollments, setEnrollments] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async function getEnrollments() {
            try {
                const res = await axios.get(baseUrl, { withCredentials: true });
                setEnrollments(res.data);
            }
            catch (e) {
                console.log("can't fetch enrollments", e.data);
            }
        })();
    }, []);

    function openCourse(courseId) {
        navigate(`/learning/${courseId}/`);
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    return (
        <div className="student-dashboard" style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
            <div>
                <h1 className="dashboard-title">Hi {storedUser?.username}</h1>
                <img src={`/avatar/${storedUser?.avatar}.png`} alt={`Avatar ${storedUser?.avatar}`} />
            </div>
            <div className="enrollment-grid">
                {enrollments?.map((en) => (
                    <div className="enrollment-card" key={en.id}>
                        <div className="course-title">{en.course_title}</div>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar"
                                style={{ width: `${en.progress_percent}%` }}
                            ></div>
                        </div>
                        <div className="progress-text">{en.progress_percent}% Completed</div>
                        <div>
                            <button className="open-btn" onClick={() => openCourse(en.course)}>
                                Open
                            </button>
                            <button onClick={() => HandleDialog({ textName: "unenroll from", title: en.course })} style={{ color: "red", marginLeft: '10px' }}>Unenroll</button>
                        </div>
                    </div>
                ))}
            </div>
            {/* <HandleDialog textName={'unenroll from'} title={'hehe'} /> */}
        </div>
    );
}
function HandleDialog(props) {
    return (
        <div className="areYouSure">
            <h3>Do you want to {props.name} this course?</h3>
            <h2>{props.title}</h2>
            <div style={{display:'flex', justifyItems:"flex-end"}}>
                <button style={{backgroundColor:'var(--bg)', color:"var(--color)", border:"1px solid var(--color)"}}>No</button>
                <button style={{marginLeft:'10px'}}>
                    Delete
                </button>
            </div>
        </div>
    )
}
