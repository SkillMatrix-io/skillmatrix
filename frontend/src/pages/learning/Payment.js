import { useParams } from "react-router-dom"
import { Enroll } from "../courses/Courses"

export default function Payment(){
    const {id} = useParams()

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return (
        <div style={{minHeight:"81.7vh", display:"flex",justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
        Let's consider you paid... for this courseID: {id}
<br/>
            <Enroll user={user} courseId={id} price={'0.00'} />
        </div>
    )
}
