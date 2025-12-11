// src/features/blind-test/components/BlindTestLayout.tsx

import React from "react";
import { globalBackgroundSecondary } from "../../../style/globalStyles";
import "../styles/blindTest.css";

type Props = {
  children: React.ReactNode;
};

export const BlindTestLayout: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="blindtest-layout"
      style={{
        ...globalBackgroundSecondary,
      }}
    >
      {children}
    </div>
  );
};
