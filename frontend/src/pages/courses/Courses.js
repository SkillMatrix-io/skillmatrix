import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ViewCourse from '../../components/ui/ViewCourse';
import StarRating from "../../components/functional/StarRatings";
import { showToast } from "../../components/functional/Toast";

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`;

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [query, setQuery] = useState("");


    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [enrollments, setEnrollments] = useState(null)

    // const storedUser = localStorage.getItem('user');
    // const user = storedUser ? JSON.parse(storedUser) : null;
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${baseUrl}courses/`)
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!user) return;

        const role = user.role?.toLowerCase();
        if (role === "teacher") return;

        if (role === "student") {
            (async () => {
                try {
                    const res = await axios.get(`${baseUrl}my_enrollments/`, { withCredentials: true });
                    setEnrollments(res.data);
                } catch (e) {
                    console.error("can't fetch enrollments", e.response?.data || e.message);
                }
            })();
        }
    }, [user]);

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

    const [categories] = useState([
        { "id": 3, "name": "Artificial Intelligence" },
        { "id": 8, "name": "Blockchain" },
        { "id": 6, "name": "Cloud Computing" },
        { "id": 7, "name": "Cybersecurity" },
        { "id": 2, "name": "Data Science" },
        { "id": 10, "name": "Game Development" },
        { "id": 4, "name": "Machine Learning" },
        { "id": 5, "name": "Mobile App Development" },
        { "id": 9, "name": "UI/UX Design" },
        { "id": 1, "name": "Web Development" }
    ]);

    const filteredCourses = courses.filter(c => {
        const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());

        const matchesCategory =
            selectedCategories.length === 0 ||
            c.categories.some(cat => selectedCategories.includes(String(cat.id)));

        return matchesQuery && matchesCategory;
    });
    return (
        <div style={{ maxWidth: "80%", margin: "auto", marginTop: "15px", overflowX: "hidden", minHeight: '80vh' }}>
            <form role="search" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', width: '100%', maxWidth: '500px', padding: 0, marginBottom: "20px", margin: "auto" }}>
                <input
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ flexGrow: 1, minWidth: 0, padding: '8px 12px', borderRadius: '6px 0 0 6px', border: '1px solid #ccc', borderRight: 'none', outline: 'none', boxSizing: 'border-box', margin: 0 }}
                />
                <button
                    type="submit"
                    style={{ padding: '8px 16px', borderRadius: '0 6px 6px 0', border: '1px solid #ccc', borderLeft: 'none', backgroundColor: '#4f46e5', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', margin: 0 }}
                    onClick={(e) => e.preventDefault()} // prevent page reload
                >
                    Search
                </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {categories.map(cat => (
                    <label
                        key={cat.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            cursor: 'pointer'
                        }}
                    >
                        <input
                            type="checkbox"
                            value={cat.id}
                            checked={selectedCategories.includes(String(cat.id))}
                            onChange={e => {
                                if (e.target.checked) {
                                    setSelectedCategories(prev => [...prev, String(cat.id)]);
                                } else {
                                    setSelectedCategories(prev => prev.filter(id => id !== String(cat.id)));
                                }
                            }}
                        />
                        {cat.name}
                    </label>
                ))}
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(700px, 1fr))",
                gap: "20px",
                width: "100%",
                height: "100%",
                marginTop: "20px",
            }}>
                {filteredCourses.map((course) => {
                    const isEnrolled = enrollments?.some(
                        (enrollment) => enrollment.course === course.id
                    );
                    return (
                        <div key={course.id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "700px", aspectRatio: "20/10", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                            <div style={{ flex: 1, padding: "16px" }}>
                                <h2 style={{ margin: 0, fontSize: "", fontWeight: "bold" }}>{course.title}</h2>
                                <a href={`/profile/${course.instructor_username}/`} style={{ color: "var(--color)" }}>
                                    <h6><i>{course.instructor_username}</i></h6>
                                </a>
                                <p style={{ margin: "8px 0", color: "#555" }}>{course.description.slice(0, 100)}</p>
                                {!isEnrolled &&

                                    <em>{course.price === '0.00' ? "Free" : `₹${course.price}`}</em>
                                }
                                <StarRating rating={course.rating} />
                                {user?.role !== "teacher" && (
                                    isEnrolled ? (
                                        <button onClick={() => navigate(`/learning/${course.id}`)}>
                                            Open
                                        </button>
                                    ) : (
                                        <Enroll user={user} courseId={course.id} price={course.price} />
                                    )
                                )}
                                <button style={{ marginLeft: "10px" }} onClick={() => handleView(course.id)}>View</button>
                            </div>
                            <div style={{
                                flex: "0 0 40%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--bg)"
                            }}
                            >
                                <img
                                    src={course.cover_image === "" ? '/potato.jpeg' : decodeURIComponent(course.cover_image)}
                                    alt="course_cover_img"
                                    style={{
                                        width: "105%",
                                        height: "110%",
                                        right: "-10px",
                                        objectFit: "cover",
                                        position: "relative",

                                    }}
                                    loading="lazy"
                                />
                            </div>

                        </div>
                    )
                })
                }
            </div>

            {selectedCourse && (
                <ViewCourse
                    course={selectedCourse}
                    onClose={closeView}
                />
            )}
        </div>
    );
}

export function Enroll(props) {
    const navigate = useNavigate()

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    async function handleEnroll(courseId) {
        if (!props.user) {
            navigate('/auth/register')
        }
        else if (props.price !== '0.00') {
            // if user is premimum skip this condition....
            // or for better security let the other page handle it... where the server directly checks if the user is premium or not and well does the rest
            if (!user || user.role !== 'student') {
                navigate('/auth/login')
            } else {
                navigate(`/payment/${courseId}`)
            }
        }
        else {
            const response = await axios.post(`${baseUrl}enrollments/`,
                {
                    course: courseId,
                    access_type: 'normal',
                }, { withCredentials: true }
            )
            showToast.success(response.data.message + "~ navigating you to the course")
            navigate(`/learning/${courseId}`)
        }
    }
    return (
        <button onClick={() => handleEnroll(props.courseId)}>
            {props.text || "Enroll"}
        </button>
    )
}