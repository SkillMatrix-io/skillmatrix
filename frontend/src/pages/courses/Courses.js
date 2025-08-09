import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = `${process.env.REACT_APP_API_URL}/api/courses/`;

export default function Courses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get(baseUrl)
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