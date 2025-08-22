import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Enroll } from './pages/courses/Courses';

const baseUrl = `${process.env.REACT_APP_API_URL}/api/courses`

function App() {
  const [example, setExample] = useState(null)
  const [user, setUser] = useState(null)

  const storedUser = localStorage.getItem("user");

  useEffect(() => {
    setUser(storedUser)
  }, [storedUser])

  useEffect(() => {
    (async () => {
      const res = await axios.get(baseUrl, { withCredentials: false });
      setExample(res.data.slice(0, 3));
    })();
  }, []);

  return (
    <div className="App" style={{ overflowX: "hidden" }}>
      <div className='text-center display-1 fw-semibold text-info mb-3'>Learn Skills <span className='text-primary'>That Matter</span></div>
      <div className="hero">
        <div className="row d-flex align-items-center" style={{ minHeight: "50vh" }}>
          <div className="col display-5 text-end text-info">
            Build in-demand skills through interactive courses and hands-on projects.
          </div>
          <div className="col">
            <img src='/skillup.svg' alt="Skill up Illustration" className='rounded mx-auto d-block img-fluid' />
          </div>
        </div>

        <div className="row d-flex align-items-center text-info" style={{ minHeight: "50vh" }}>
          <div className="col">
            <img src='/group-discussion.svg' alt="Skill up Illustration" className='rounded mx-auto d-block img-fluid' />
          </div>
          <div className="col text-start display-5">
            Join thousands of learners and expert instructors on Skill Matrix.
          </div>
        </div>
      </div>
      <div className='Courses'>
        <div className='text-center fw-semibold display-1 mt-3'>
          <span className='text-info'>Explore</span> <span className='text-primary'>Courses</span>
        </div>
        <p className='text-info text-center display-5 fw-light'>Learn from industry experts and build job-ready skills</p>
        <div className='row d-flex justify-content-center align-items-center'>
          {example && example.map((course) => (
            <div key={course.id} className="card m-2" style={{ width: "18rem" }}>

              <img
                src={course.cover_image === "" ? '/potato.jpeg' : decodeURIComponent(course.cover_image)}
                alt="course_cover_img"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
                loading="lazy"
              />
              <div className='card-header'>
                <h5 className="card-title">{course.title}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">Web Development</h6>
                <div className="card-body">
                  <p className="card-text">{course.description.slice(0,25) + "..."}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Enroll user={user} courseId={course.id} text="Enroll Now" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='Personalization text-center mb-5'>
        <div className='text-center display-1 fw-semibold mt-5'><span className='text-info'>Personalized</span><span className='text-primary'>Experience</span></div>

        <p className='text-info text-center display-5 fw-light'>Track your progress and manage your learning journey</p>
      </div>
    </div>
  );
}

export default App;
