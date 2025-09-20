import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "../../components/functional/StarRatings";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // for tables, strikethrough, etc.
import { showToast } from "../../components/functional/Toast";

export default function LearnCourse() {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [rating,setRating] = useState(0)
    const [review,setReview]= useState(null)
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/learn_course/${id}`;
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState("overview");

    useEffect(() => {
        (async function fetchData() {
            try {
                const res = await axios.get(baseUrl, { withCredentials: true });
                setCourseData(res.data);
            } catch (err) {
                console.error("Error fetching course:", err);
                alert(err.response.data.detail)
            }
        })();
    }, [baseUrl]);

    if (!courseData) return <div>Loading...</div>;

    const lessons = courseData.lessons || [];


    const handleSubmit = async () => {
        try {
            const res  = await axios.post(`${process.env.REACT_APP_API_URL}/api/feedback/${id}/`, {
                rating,
                review,
            }, { withCredentials: true });
            showToast.success(res.data.message)
            navigate('/'); // or show success toast
        } catch (err) {
            console.error("Feedback error:", err);
        }
    };

    const renderContent = () => {
        if (currentPage === "overview") {
            return (
                <div>
                    <h1>{courseData.course.title}</h1>
                    <p>{courseData.course.description}</p>
                    <p>Total Lessons: {lessons.length}</p>

                    {/*rating placeholder*/}
                    <div><p>Ratings: </p><StarRating rating={courseData.rating || 0} /></div>
                </div>
            )
        }
        if (currentPage === "feedback") {
            return (
                <div style={{
                    marginLeft:"auto",
                    marginRight:"auto",
                    width:"50%",
                    justifyContent:"center",
                    alignItems:"center"
                }}>
                    <h2>Course Feedback</h2>
                    <p>Rate this course:</p>
                    <input
                        type="number"
                        min={1}
                        max={5}
                        value={rating}
                        onChange={e => setRating(e.target.value)}
                        placeholder="1-5"
                    />
                    <textarea
                        value={review}
                        style={{
                            width:"100px",
                            height:"200px"
                        }}
                        onChange={e => setReview(e.target.value)}
                        placeholder="Your feedback here (required)"

                    />
                    <button onClick={handleSubmit}>Submit & Go</button>
                </div>
            );
        }
        const lesson = lessons.find(ls => ls.id === currentPage);
        if (!lesson) return <div>Lesson not found</div>

        return (
            <div>
                <h2>{lesson.title}</h2>
                <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lesson.text_content}
                    </ReactMarkdown>
                </div>
                {lesson.content_type === "pdf" && (
                    <iframe
                        src={lesson.content_url}
                        width="100%"
                        height="600px"
                        title={lesson.title}
                    ></iframe>
                )}
                {lesson.content_type === "video" && (
                    <video width="100%" height="auto" controls>
                        <source src={lesson.content_url} type="video/mp4" />
                        Your browser doesn't support video.
                    </video>
                )}
            </div>
        )
    }
    return (
        <>
            <div style={{ display: "flex", height: "100vh" }}>
                {/* main content */}
                <div style={{ flex: 3, padding: "1rem", overflowY: "auto" }}>
                    {renderContent()}
                </div>

                {/* Sidebar */}
                <div style={{
                    flex: 1,
                    borderLeft: "1px solid var(--color)",
                    padding: "1rem",
                    overflowY: "auto"
                }}>
                    <h3>Lessons</h3>
                    <button onClick={() => setCurrentPage("overview")}
                        style={{
                            display: "block", marginBottom: "10px",
                            minWidth: "69%",
                        }}>
                        Course Overview
                    </button>
                    {lessons.map(lesson => (
                        <button key={lesson.id}
                            onClick={() => setCurrentPage(lesson.id)}
                            style={{
                                display: "block",
                                marginBottom: "10px",
                                color: "var(--color)",
                                minWidth: "69%",
                                border: "1px solid var(--color)",
                                backgroundColor: currentPage === lesson.id ? "var(--bg)" : "transparent"
                            }} >
                            {lesson.title}
                        </button>
                    ))}
                    {courseData.rating === -1 ? 
                    <button onClick={() => setCurrentPage("feedback")}
                        style={{ display: "block", marginTop: "20px", color: "red", minWidth: "69%" }}
                    >Give Feedback</button> :<button style={{ display: "block", marginTop: "20px", color: "red", minWidth: "69%" }} onClick={()=>navigate('/')}>Go Home</button>
                    }
                </div>
            </div>
        </>
    );
}
