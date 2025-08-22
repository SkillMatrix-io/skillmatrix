import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ViewCourse from './ViewCourse';
import './Course.css';

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`;

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollments, setEnrollments] = useState(null);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();

    async function handleEnroll(courseId) {
        if (!user) {
            navigate('/auth/register');
        } else {
            const response = await axios.post(`${baseUrl}enrollments/`,
                {
                    course: courseId,
                    access_type: 'normal',
                }, { withCredentials: true }
            );
            alert(response.data.message);
            navigate(`/learning/${courseId}`);
        }
    }

    useEffect(() => {
        axios.get(`${baseUrl}courses/`)
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        (async function getEnrollments() {
            try {
                const res = await axios.get(`${baseUrl}my_enrollments/`, { withCredentials: true });
                setEnrollments(res.data);
            }
            catch (e) {
                console.log("can't fetch enrollments", e.data);
            }
        })();
    }, []);

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
        <div className="courses-container">
            {courses.map(course => {
                const isEnrolled = enrollments?.some(enrollment => enrollment.course === course.id);
                return (
                    <div key={course.id} className="course-card">
                        <h2 className="course-title">{course.title}</h2>
                        <p className="course-description">{course.description}</p>
                        <p className="course-price">Price: ₹{course.price}</p>
                        <p className="course-ratings">Ratings: {course.ratings}</p>
                        {(!user || user?.role !== "teacher") && (
                            isEnrolled ? (
                                <button className="btn btn-primary course-btn" onClick={() => navigate(`/learning/${course.id}`)}>
                                    Open
                                </button>
                            ) : (
                                <button className="btn btn-primary course-btn" onClick={() => handleEnroll(course.id)}>
                                    Enroll
                                </button>
                            )
                        )}
                        <button className="btn btn-secondary course-btn" onClick={() => handleView(course.id)}>View</button>
                    </div>
                );
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
