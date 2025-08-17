import React from "react";

export default function StarRating({ rating }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push("★"); // full star
        } else if (rating >= i - 0.5) {
            stars.push("☆"); // could swap for half-star symbol or CSS
        } else {
            stars.push("✩"); // empty star
        }
    }
    return <div style={{ fontSize: "1.5rem", color: "gold" }}>{stars.join(" ")}</div>;
}