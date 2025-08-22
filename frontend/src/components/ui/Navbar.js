import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import axios from "axios";
import './Navbar.css';

const baseURL = `${process.env.REACT_APP_API_URL}/api`;

export default function Navbar() {
  // logout function dont remove. or take it along with the logout button 
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/auth/logout/`, null, { withCredentials: true });
      localStorage.removeItem("user");
      navigate('/');
    } catch (e) {
      console.log('Error logging out ' + (e.response?.data?.message || e.message));
    }
  };
  // logout function ends here

  const { theme, toggleTheme } = useTheme();
  function HandleDevs() {
    navigate('/devs')
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src="/SKILL_MATRIX_LOGO.png" alt="SkillMatrix Logo" width="30" height="24" style={{ maxWidth: '150px', height: 'auto' }} />
          </a>
          <Link className="navbar-brand text-primary fw-semibold" to={'/'}>SkillMatriX</Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleMenu}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse navbar-nav ${menuOpen ? "show" : ""}`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto ms-auto mb-2 mb-lg-0">

              {user &&
                <li className="nav-item">
                  <Link className="nav-link fs-5" to={`/dashboard/${user.role}`}>Dashboard</Link>
                </li>
              }

              <li className="nav-item">
                <Link className="nav-link fs-5" to={'/courses'}>Courses</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-5" to={'/about'}>About Us</Link>
              </li>

              {!user &&
                <li className="nav-item">
                  <Link className="nav-link fs-5" to={'/auth/login'}>Login</Link>
                </li>}
            </ul>

            <form role="search" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', width: '100%', maxWidth: '500px', padding: 0, margin: 0, }}>
              <input type="search" placeholder="Search" aria-label="Search" style={{ flexGrow: 1, minWidth: 0, padding: '8px 12px', borderRadius: '6px 0 0 6px', border: '1px solid #ccc', borderRight: 'none', outline: 'none', boxSizing: 'border-box', margin: 0, }} />
              <button type="submit" style={{ padding: '8px 16px', borderRadius: '0 6px 6px 0', border: '1px solid #ccc', borderLeft: 'none', backgroundColor: '#4f46e5', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', margin: 0, }}>Search
              </button>
            </form>

            {!user && <Link className="nav-link" to={'/auth/register'}><button className="btn btn-primary ms-2 fs-5 m-2">Register</button></Link>}
            <button className="nav-link btn btn-primary m-2" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <Sun /> : <Moon />}</button>

            {/* logout button calling the logout function */}
            {user && <button className="btn btn-logout m-2" onClick={handleLogout}>Logout</button>}
          </div>
        </div>
      </nav>

      <button onClick={() => HandleDevs()} style={{ border: "var(--color) 1px solid", position: "fixed", bottom: "10px", left: "1%" }}>Meet the devs!</button>
    </>
  );
}
