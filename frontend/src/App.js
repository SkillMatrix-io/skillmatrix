  import './App.css';

  function App() {

    return (
      <div className="App">
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
            <div class="card m-2" style={{width: "18rem"}}>
              <img src="/potato.jpeg" class="card-img-top" alt="..." />
              <div className='card-header'>
                <h5 class="card-title">Introduction to React.js</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">Web Development</h6>
              </div>
              <div class="card-body">
                
                
                <p class="card-text">A complete begineers guide to start with React.js</p>
                <div class="d-flex justify-content-between align-items-center">
                  <p class="mb-0">6 hours</p>
                  <a href="#" class="btn btn-primary text-light">Enroll Now</a>
                </div> 
              </div>
            </div>
            <div class="card m-2" style={{width: "18rem"}}>
              <img src="/potato.jpeg" class="card-img-top" alt="..." />
              <div className='card-header'>
                <h5 class="card-title">Introduction to React.js</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">Web Development</h6>
              </div>
              <div class="card-body">
                
                
                <p class="card-text">A complete begineers guide to start with React.js</p>
                <div class="d-flex justify-content-between align-items-center">
                  <p class="mb-0">6 hours</p>
                  <a href="#" class="btn btn-primary text-light">Enroll Now</a>
                </div> 
              </div>
            </div>
            <div class="card m-2" style={{width: "18rem"}}>
              <img src="/potato.jpeg" class="card-img-top" alt="..." />
              <div className='card-header'>
                <h5 class="card-title">Introduction to React.js</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">Web Development</h6>
              </div>
              <div class="card-body">
                
                
                <p class="card-text">A complete begineers guide to start with React.js</p>
                <div class="d-flex justify-content-between align-items-center">
                  <p class="mb-0">6 hours</p>
                  <a href="#" class="btn btn-primary text-light">Enroll Now</a>
                </div> 
              </div>
            </div>
          </div>
        </div>
      </div>


    );
  }

  export default App;
