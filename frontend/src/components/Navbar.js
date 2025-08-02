import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeProvider"
import { Moon, Sun } from "lucide-react"
import './Navbar.css'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  return (
    <nav class="navbar navbar-expand-lg ">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img src="/SKILL_MATRIX_LOGO.png" alt="SkillMatrix Logo" width="30" height="24" style={{ maxWidth: '150px', height: 'auto' }} />
        </a>
        <Link className="navbar-brand text-primary fs-1" to={'/'}>SkillMatriX</Link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <Link className="nav-link fs-5" to={'/dashboard'}>Dashboard</Link>
            </li>
            <li class="nav-item">
              <Link className="nav-link fs-5" to={'/courses'}>Courses</Link>
            </li>
            <li class="nav-item">
              <Link className="nav-link fs-5" to={'/auth/login'}>Login</Link>
            </li>
          </ul>
          <form class="d-flex" role="search">
            <input class="form-control m-2" type="search" placeholder="Search" aria-label="Search" />
            <button class="btn btn-outline-success m-2" type="submit">Search</button>
          </form>
          <Link className="nav-link" to={'/auth/register'}><button className="btn btn-primary ms-2 fs-5 m-2">Register</button></Link>
          <button className="nav-link btn btn-primary m-2" onClick={toggleTheme}>{theme === 'dark' ? <Sun /> : <Moon />}</button>
        </div>
      </div>
    </nav>

  );
}