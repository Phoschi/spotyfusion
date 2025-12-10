// src/features/blind-test/components/BlindTestLayout.tsx

import React from "react";
import {
  globalBackgroundSecondary,
} from "../../../style/globalStyles";
import "../styles/blindTest.css";

type Props = {
  children: React.ReactNode;
};

export const BlindTestLayout: React.FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        ...globalBackgroundSecondary,
        width: "77vw",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
};
