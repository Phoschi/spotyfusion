import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Ici tu feras ton vrai login Spotify plus tard
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}