import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ViewCourse from './ViewCourse';

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`;

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate()

    async function handleEnroll(courseId) {
        if (!user) {
            navigate('/auth/register')
        } else {
            const response = await axios.post(`${baseUrl}enrollments/`,
                {
                    course: courseId,
                    access_type: 'normal',
                }, { withCredentials: true }
            )
            alert(response.data.message)
        }
    }

    useEffect(() => {
        axios.get(`${baseUrl}courses/`)
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);
    // const coursesString = JSON.stringify(courses)

    async function handleView(courseId) {
        try {
            const res = await axios.get(`${baseUrl}courses/${courseId}`);
            setSelectedCourse(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    function closeView() {
        setSelectedCourse(null);
    }

    return (
        <>
            {courses.map((course) => (
                <div key={course.id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
                    <h2>{course.title}</h2>
                    <p>{course.description}</p>
                    <p>Price: ₹{course.price}</p>
                    <p>Ratings: {course.ratings}</p>
                    {(!user || user?.role !== 'teacher') && (<button onClick={() => handleEnroll(course.id)}>Enroll</button>)}
                    <button onClick={() => handleView(course.id)}>View</button>
                </div>
            ))}
            {selectedCourse && (
                <ViewCourse
                    course={selectedCourse}
                    onClose={closeView}
                />
            )}
        </>
    );
}