import { useEffect, useRef } from "react";
import StarRating from "../functional/StarRatings";

export default function ViewCourse({ course, onClose }) {
    const overlayRef = useRef(null);

    // Close if clicked outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (overlayRef.current && e.target === overlayRef.current) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={overlayRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >
            <div style={{
                color: "black",
                background: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "600px",
                width: "90%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}>

                <img src={course.cover_image === "" ? '/potato.jpeg' : decodeURIComponent(course.cover_image)} alt="Course Banner" style={{
                    width: "100%",
                    height: "100%",
                    borderRadius:"12px"

                }}
                    loading="lazy" />
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <p>Price: <code style={{fontSize:"1.2rem"}}>₹{course.price}</code></p>
                <div style={{marginBottom:"3px"}}>Ratings: <StarRating rating={course.ratings || 0} /></div>
                Categories: 
                <div style={{ display: "flex", gap: "5px",marginBottom:"3px" }}>
                    {course?.categories.map((e) => (
                        <span key={e.id} style={{ fontSize: "0.8rem", border: "0.1px solid var(--bg)", padding: "3px", borderRadius: "2px" }}>
                            {e.name}
                        </span>
                    ))}
                </div>
                <button style={{border:"black 1px solid"}} onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

