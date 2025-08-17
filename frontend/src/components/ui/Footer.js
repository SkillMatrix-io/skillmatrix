export default function Footer() {
  return (
    <footer className="footer-section text-center">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} SkillMatriX</p>
        <div className="footer-links">
          <a href="https://storyset.com/work" target="_blank" rel="noopener noreferrer">
            Work illustrations by Storyset
          </a> <br />
          <a href="https://freepik.com/" target="_blank" rel="noopener noreferrer">
            Avatar collections by freepik
          </a>
        </div>
      </div>
    </footer>
  );
}
