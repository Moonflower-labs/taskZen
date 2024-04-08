/* eslint-disable react/prop-types */
import { calculateCompletionPercentage } from "../utils/helpers";

const Progress = ({ tasks }) => {
  return (
    <>
      <div
        className="progress"
        role="progressbar"
        aria-label="Basic example"
        aria-valuenow={calculateCompletionPercentage(tasks)}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-bar bg-success"
          style={{
            width: `${calculateCompletionPercentage(tasks)}%`,
          }}
        >
          {calculateCompletionPercentage(tasks)}%
        </div>
      </div>
    </>
  );
};

export default Progress;
