import { useEffect, useRef } from "react";
import StarRating from "../../components/StarRatings";
import './Course.css';

export default function ViewCourse({ course, onClose }) {
    const overlayRef = useRef(null);

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
        <div ref={overlayRef} className="vc-overlay">
            <div className="vc-modal">
                <h2 className="vc-title">{course.title}</h2>
                <p className="vc-description">{course.description}</p>
                <p className="vc-price">Price: ₹{course.price}</p>
                <div className="vc-ratings">Ratings: <StarRating rating={course.ratings || 0} /></div>
                <button className="vc-close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
