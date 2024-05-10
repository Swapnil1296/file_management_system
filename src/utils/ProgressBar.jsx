import React, { useState, useEffect } from "react";

const MIN = 0;
const MAX = 100;

const ProgressBar = ({ value = 0, onComplete = () => {} }) => {
  const [percent, setPercent] = useState(value);

  useEffect(() => {
    setPercent(Math.min(Math.max(value, MIN), MAX));

    if (value >= MAX) {
      onComplete();
    }
  }, [value, onComplete]);

  return (
    <div className="relative  h-5 w-1/2 bg-gray-200 border border-gray-300 rounded-3xl overflow-hidden">
      <span
        className={`absolute h-5 w-full flex justify-center items-center ${
          percent > 49 ? "text-white" : "text-black"
        }`}
      >
        {percent.toFixed()}%
      </span>
      <div
        className="bg-green-500 h-5 text-white text-center"
        style={{ width: `${percent}%` }}
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={percent}
        role="progressbar"
      />
    </div>
  );
};

export default ProgressBar;
