import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './StudentDashboard.css';
import { showToast } from "../../components/functional/Toast";

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
        <div className="student-dashboard" style={{ display: 'flex', flexDirection: "column", alignItems: "center", minHeight:"80vh" }}>
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
                            <UnenrollButton enID={en.id} courseTitle={en.course_title} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UnenrollButton({ enID, courseTitle }) {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()


    const unenrollUrl = `${process.env.REACT_APP_API_URL}/api/`;
    async function handleUnenroll() {
        try {
            const response = await axios.delete(`${unenrollUrl}enrollments/${enID}/`, { withCredentials: true })
            showToast.success(response.data.message || "Unenrolled successfully")
            setOpen(false)
            navigate("/courses") // or wherever you want after unenroll
        } catch (error) {
            console.error(error)
            showToast.error(error.response?.data?.message || "Failed to unenroll")
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                style={{ color: "red", marginLeft: "10px" }}
            >
                Unenroll
            </button>

            {open && (
                <div className="areYouSure">
                    <h3>Do you want to unenroll from this course?</h3>
                    <h2>{courseTitle}</h2>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                            onClick={() => setOpen(false)}
                            style={{ backgroundColor: "var(--bg)", color: "var(--color)", border: "1px solid var(--color)" }}
                        >
                            No
                        </button>
                        <button
                            onClick={handleUnenroll}
                            style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}