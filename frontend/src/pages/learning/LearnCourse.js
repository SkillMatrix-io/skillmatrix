import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "../../components/functional/StarRatings";

export default function LearnCourse() {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
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
                <div>
                    <h2>Course Feedback</h2>
                    <p>Rate this course:</p>
                    <input type="number" min={1} max={5} placeholder="1-5" />
                    <textarea placeholder="Your feedback here"></textarea>
                    <button onClick={() => navigate('/')}>Submit & Go</button>
                </div>
            );
        }
        const lesson = lessons.find(ls => ls.id === currentPage);
        if (!lesson) return <div>Lesson not found</div>

        return (
            <div>
                <h2>{lesson.title}</h2>
                <p>{lesson.text_content}</p>
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
    <div style={{display:"flex", height:"100vh"}}>
        {/* main content */}
        <div style={{flex:3,padding:"1rem",overflowY:"auto"}}>
            {renderContent()}
        </div>

        {/* Sidebar */}
        <div style={{
            flex: 1,
            borderLeft: "1px solid var(--color)",
            padding: "1rem",
            overflowY:"auto"
        }}>
            <h3>Lessons</h3>
            <button onClick={()=>setCurrentPage("overview")}
            style={{display:"block",marginBottom:"10px"}}>
                Course Overview
            </button>
            {lessons.map(lesson => (
                <button key={lesson.id}
                onClick={()=>setCurrentPage(lesson.id)}
                style={{display:"block",
                    marginBottom: "10px",
                    backgroundColor: currentPage === lesson.id ? "#eee" : "transparent"
                }} >
                    {lesson.title}
                </button>
            ))}
            <button onClick={()=>setCurrentPage("feedback")}
            style={{display:"block",marginTop:"20px",color:"red"}}
            >Give Feedback</button>
        </div>
    </div>
        </>
    );
}
