// src/features/blind-test/components/QuestionProgressIndicator.tsx

import React from "react";

type Props = {
  current: number;
  total: number;
};

export const QuestionProgressIndicator: React.FC<Props> = ({
  current,
  total,
}) => (
  <span>
    {current}/{total}
  </span>
);
