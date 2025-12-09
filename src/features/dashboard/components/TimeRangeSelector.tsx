import React from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = {
  short_term: "4 semaines",
  medium_term: "6 mois",
  long_term: "Tout le temps",
};

export const TimeRangeSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
      {Object.entries(OPTIONS).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            color: "white",
            backgroundColor: key === value ? "#1DB954" : "#333",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
