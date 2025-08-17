export default function Page404() {
    return (
        <div
            style={{
                background: "var(--bg)",
                color: "var(--color)",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontFamily: "sans-serif",
            }}
        >
            <h1 style={{ fontSize: "5rem", margin: "0" }}>404</h1>
            <h2 style={{ margin: "0.5rem 0" }}>Lost in the void</h2>
            <p style={{ maxWidth: "400px", margin: "1rem 0" }}>
                This page doesn’t exist. Maybe it never did.
                Or maybe it ran away with your other unfinished projects. 🚀
            </p>
            <button
                onClick={() => (window.location.href = "/")}
                style={{
                    marginTop: "1rem",
                    padding: "0.6rem 1.2rem",
                    border: "1px solid var(--color)",
                    background: "transparent",
                    color: "var(--color)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = "var(--color)";
                    e.currentTarget.style.color = "var(--bg)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color)";
                }}
            >
                Teleport Home
            </button>
        </div>
    );
}
