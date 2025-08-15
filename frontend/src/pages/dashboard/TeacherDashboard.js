import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const baseUrl = `${process.env.REACT_APP_API_URL}/api/courses/`;

export default function TeacherDashboard() {
    const [teacherCourses, setTeacherCourses] = useState([]);
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();

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


    async function handlePublish(courseId, status) {
        try {
            const response = await axios.post(`${baseUrl}publishing/${courseId}/`, {
                status: status
            }, { withCredentials: true })
            setTeacherCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === courseId
                        ? { ...course, is_published: true }
                        : course
                )
            );
            alert(response.data.status)
        } catch (e) {
            console.error("error in changing publish status", e)
        }
    }

    async function handleDelete(courseId) {
        try {
            await axios.delete(`${baseUrl}delete/${courseId}/`, { withCredentials: true });

            setTeacherCourses(prev => prev.filter(c => c.id !== courseId));

            alert("course deleted")
        } catch (e) {
            console.error("Error deleting course", e);
        }
    }

    function handleEdit(courseId) {
        navigate(`/create_edit/${courseId}`);
    }

    return (
        <div>
            <h1>Hi, {storedUser?.username} 👋</h1>
            <img src={`/avatar/${storedUser?.avatar}.png`} alt={`Avatar ${storedUser?.avatar}`} />
            <p>
                <Link to="/create_edit/new">Create Course</Link>
            </p>
            <div>
                <h3>Your courses</h3>
                {teacherCourses.map((course, key) => (
                    <div key={key}>
                        <b>
                            {course?.title}
                        </b>
                        <button onClick={() => handleEdit(course.id)}>Edit Course</button>
                        <button onClick={() => handlePublish(course.id, course.is_published)}>{course?.is_published ? 'Unpublish Course' : 'Publish Course'}</button>
                        <button onClick={() => handleDelete(course.id)}>Delete Couses</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
