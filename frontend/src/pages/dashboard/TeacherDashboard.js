import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/functional/Toast";
import './dashboard.css'
import { toast } from "react-toastify";

const baseUrl = `${process.env.REACT_APP_API_URL}/api/courses/`;

export default function TeacherDashboard() {
    const [teacherCourses, setTeacherCourses] = useState([]);
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();

    const [bio, setBio] = useState(storedUser?.bio || "");
    const [isDirty, setIsDirty] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsDirty(bio !== (storedUser?.bio || ""));
    }, [bio, storedUser?.bio]);

    const handleChange = (e) => {
        setBio(e.target.value);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/users/save-bio/${storedUser.id}/`,
                { bio },
                { withCredentials: true }
            );
            console.log("Bio saved:", res.data.bio);
            storedUser.bio = bio
            localStorage.setItem("user",JSON.stringify(storedUser))
            setIsDirty(false);
        } catch (err) {
            console.error("Failed to save bio", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${baseUrl}instructor/`, { withCredentials: true });
                setTeacherCourses(response.data);
            } catch (e) {
                console.error("Error in fetching your courses", e);
                setTeacherCourses([]);
            }
        };

        fetchCourses();
    }, []); // fetch only once on mount


    async function handlePublish(courseId, newStatus) {
        try {
            const response = await axios.post(
                `${baseUrl}publishing/${courseId}/`,
                { status: newStatus },
                { withCredentials: true }
            );

            setTeacherCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === courseId
                        ? { ...course, is_published: newStatus }
                        : course
                )
            );

            showToast.success(response.data.status);
        } catch (e) {
            console.error("error in changing publish status", e);
            showToast.error("Error changing status")
        }
    }

    async function handleDelete(courseId) {
        try {
            await axios.delete(`${baseUrl}delete/${courseId}/`, { withCredentials: true });

            setTeacherCourses(prev => prev.filter(c => c.id !== courseId));

            showToast.success("Course deleted")
        } catch (e) {
            console.error("Error deleting course", e);
            showToast.error("Error deleting course")
        }
    }

    function handleEdit(courseId) {
        navigate(`/create_edit/${courseId}`);
    }

    function handleCreate() {
        navigate('/create_edit/new')
    }

    useEffect(() => {
        if (loading) {
            showToast.loading("Upating Bio...");
        } else {
            setTimeout(() => {
                toast.dismiss("global-loader");
            }, 1000)
        }
    }, [loading]);

    return (
        <div style={{ maxWidth: "80%", margin: "auto", display: "flex", gap: "10px" }}>
            <div className="main-container">
                <h1>Hi, {storedUser?.username} 👋</h1>
                <img src={`/avatar/${storedUser?.avatar}.png`} alt={`Avatar ${storedUser?.avatar}`} />
                <div>
                    <button onClick={() => handleCreate()}>Create Course</button>
                    <button>Share Profile</button>
                </div>

                <div>
                    <h3>Your courses</h3>
                    {teacherCourses.map((course, key) => (
                        <div key={key} className="course-card" style={{display:"flex", justifyContent:"space-between"}}>
                            <b>{course?.title}</b>
                            <div>
                                <button onClick={() => handleEdit(course.id)}>Edit</button>
                                <button onClick={() => handlePublish(course.id, !course.is_published)}>
                                    {course.is_published ? 'Unpublish' : 'Publish'}
                                </button>
                                <button style={{ color: "red" }} onClick={() => handleDelete(course.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="side-container">
                <h3>Bio</h3>
                <textarea
                    style={{ maxHeight: "400px", height: "200px", width: "80%", backgroundColor: "transparent", color: "var(--color)" }}
                    value={bio}
                    onChange={handleChange}
                    placeholder="Write your bio..."
                />
                {isDirty && (
                    <button onClick={handleSave} disabled={loading && !isDirty}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                )}
            </div>
        </div>
    );
}
