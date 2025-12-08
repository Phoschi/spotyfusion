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
      <main>
        <Outlet />
      </main>
    </div>
  );
}