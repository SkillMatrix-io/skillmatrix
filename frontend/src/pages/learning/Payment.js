import { useParams } from "react-router-dom"
import { Enroll } from "../courses/Courses"

export default function Payment(){
    const {id} = useParams()

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return (
        <>
        Let's consider you paid...
        {id}

            <Enroll user={user} courseId={id} price={'0.00'} />
        </>
    )
}
