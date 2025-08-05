export default function About() {
     return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-3 fw-bold text-info">About <span className="text-primary">Skill Matrix</span></h1>
        <p className="lead text-secondary">Empowering you to learn the skills that truly matter.</p>
      </div>

      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <img src="/About_2.svg" alt="About Skill Matrix" className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h2 className="fw-semibold text-info">Our Mission</h2>
          <p className="text-secondary fs-5">
            At Skill Matrix, our mission is to bridge the gap between ambition and achievement by providing high-quality, interactive courses taught by industry experts.
            We believe in making education accessible, engaging, and relevant for the modern world.
          </p>
        </div>
      </div>

      <div className="row align-items-center flex-md-row-reverse mb-5">
        <div className="col-md-6">
          <img src="/About_1.svg" alt="Skill Matrix Team" className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h2 className="fw-semibold text-info">Who We Are</h2>
          <p className="text-secondary fs-5">
            We are a passionate team of educators, developers, and designers dedicated to creating an exceptional learning platform.
            Our commitment to innovation drives us to continually update our courses and features so you stay ahead in your career.
          </p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col text-center">
          <h2 className="fw-semibold text-info">Why Choose Skill Matrix?</h2>
          <ul className="list-unstyled d-flex justify-content-center flex-wrap gap-4 mt-3 fs-5 text-secondary">
            <li className="mb-2">Industry-relevant courses</li>
            <li className="mb-2">Hands-on projects</li>
            <li className="mb-2">Expert instructors</li>
            <li className="mb-2">Supportive learning community</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <a href="/courses" className="btn btn-primary btn-lg">Explore Our Courses</a>
      </div>
    </div>
  );
}