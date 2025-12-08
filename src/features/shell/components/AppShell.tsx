import { Link, Outlet } from "react-router-dom";

export default function AppShell() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/blind-test">Blind Test</Link></li>
          <li><Link to="/mood">Mood Generator</Link></li>
        </ul>
      </nav>

      {/* Equivalent du slide "Outlet" du cours, pages 83-84 */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}