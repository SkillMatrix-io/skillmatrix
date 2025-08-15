import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`;

export default function Courses() {
    const [courses, setCourses] = useState([]);

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

    return (
        <>
            {courses.map((course) => (
                <div key={course.id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
                    <h2>{course.title}</h2>
                    <p>{course.description}</p>
                    <p>Price: ₹{course.price}</p>
                    <p>Ratings: {course.ratings}</p>
                    {(!user || user?.role !== 'teacher') && (<button onClick={() => handleEnroll(course.id)}>Enroll</button>)}
                </div>
            ))}
        </>
    );
}
// {/* <h4>Lessons:</h4>
//     <ul>
//       {course.lessons.map((lesson) => (
//         <li key={lesson.id}>
//           <strong>{lesson.title}</strong> ({lesson.content_type})
//         </li>
//       ))} */}