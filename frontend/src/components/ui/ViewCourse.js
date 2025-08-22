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
                background: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "600px",
                width: "90%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <p>Price: ₹{course.price}</p>
                <div>Ratings: <StarRating rating={course.ratings || 0} /></div>

                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

