import React from "react";
import PrimaryButton from "../../../shared/components/PrimaryButton";
import logo from "../../../assets/Login/LogoSpotyfusion.svg";

type LoginCardProps = {
  onLoginClick: () => void;
};

const LoginCard: React.FC<LoginCardProps> = ({ onLoginClick }) => {
  return (
    <div className="login-card">
      <div className="login-card__icon">
        <img
          src={logo}
          alt="SpotyFusion Logo"
          className="login-card__logo-img"
        />
      </div>

      <h1 className="login-card__title">SpotyFusion</h1>

      <p className="login-card__subtitle">
        Enrichissez votre expérience Spotify avec
        des statistiques détaillées, des blind tests
        et un générateur de playlists intelligent
      </p>

      <PrimaryButton
        fullWidth
        onClick={onLoginClick}
        className="login-card__button"
      >
        Se Connecter avec Spotify
      </PrimaryButton>

      <p className="login-card__hint">
        Vous serez redirigé vers Spotify pour autoriser l&apos;accès
      </p>
    </div>
  );
};

export default LoginCard;
