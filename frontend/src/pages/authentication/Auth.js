// entry point for login / register page
import { useParams } from "react-router-dom"
import Login from "./Login"
import Register from "./Register"

export default function Auth() {
    const mode = useParams()
    console.log(mode)
    return (
        <div>
            {mode.mode === "login" && <Login />}
            {mode.mode === "register" && <Register />}
            {!mode && <p>Please select login or register.</p>}
        </div>
    )
}