import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ViewCourse from './ViewCourse';
import StarRating from "../../components/functional/StarRatings";

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`;

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollments, setEnrollments] = useState(null)

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
            navigate(`/learning/${courseId}`)
        }
    }

    useEffect(() => {
        axios.get(`${baseUrl}courses/`)
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);
    // const coursesString = JSON.stringify(courses)

    useEffect(() => {
        (async function getEnrollments() {
            try {
                const res = await axios.get(`${baseUrl}my_enrollments/`, { withCredentials: true })
                setEnrollments(res.data)
            }
            catch (e) {
                console.log("can't fetch enroolements", e.data)
            }
        })()
    }, [])


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
        <div style={{maxWidth:"80%",margin:"auto",marginTop:"15px"}}>
            {courses.map((course) => {
                const isEnrolled = enrollments?.some(
                    (enrollment) => enrollment.course === course.id
                );
                return (
                    <div key={course.id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
                        <h2>{course.title}</h2>
                        <p>{course.description}</p>
                        <p>Price: ₹{course.price}</p>
                        <div style={{display:"flex", alignItems:"center", gap:"10px"}}><span style={{position:"relative",top:"2px"}}>Ratings: </span><StarRating rating={course.ratings || 0}/></div>
                        <div style={{display:"flex",gap:"10px"}}>
                            {(!user || user?.role !== "teacher") && (
                                isEnrolled ? (
                                    <button onClick={() => navigate(`/learning/${course.id}`)}>
                                        Open
                                    </button>
                                ) : (
                                    <button onClick={() => handleEnroll(course.id)}>
                                        Enroll
                                    </button>
                                )
                            )}
                            <button onClick={() => handleView(course.id)}>View</button>
                        </div>
                    </div>)
            })}
            {selectedCourse && (
                <ViewCourse
                    course={selectedCourse}
                    onClose={closeView}
                />
            )}
        </div>
    );
}