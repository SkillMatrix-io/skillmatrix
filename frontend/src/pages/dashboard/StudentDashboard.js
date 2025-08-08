export default function StudentDashboard() {

    const storedUser = JSON.parse(localStorage.getItem("user"));
    return (
        <>
            <h1>
                Hi {storedUser?.username}
            </h1>

            <p>
                welcome to student dashboard here u can see stuff if we put lol
            </p>
        </>
    )
}