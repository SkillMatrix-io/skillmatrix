import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeProvider"
import { Moon, Sun } from "lucide-react"
import './Navbar.css'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="/SKILL_MATRIX_LOGO.png" alt="SkillMatrix Logo" width="30" height="24" style={{ maxWidth: '150px', height: 'auto' }} />
        </a>
        <Link className="navbar-brand text-primary fs-1" to={'/'}>SkillMatriX</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fs-5" to={'/dashboard'}>Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5" to={'/courses'}>Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5" to={'/auth/login'}>Login</Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control m-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success m-2" type="submit">Search</button>
          </form>
          <Link className="nav-link" to={'/auth/register'}><button className="btn btn-primary ms-2 fs-5 m-2">Register</button></Link>
          <button className="nav-link btn btn-primary m-2" onClick={toggleTheme}>{theme === 'dark' ? <Sun /> : <Moon />}</button>
        </div>
      </div>
    </nav>

  );
}