import Countdown from "react-countdown";

const TimerCountDown = ({ leftTime, onFinished }: { leftTime: number; onFinished?: () => void }) => {
  return (
    <Countdown
      date={Date.now() + leftTime}
      renderer={({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
          // Render a completed state
          onFinished && onFinished();
          return null;
        } else {
          // Render a countdown
          return (
            <span>
              {days}d {hours}h {minutes}m {seconds}s
            </span>
          );
        }
      }}
    />
  );
};

export default TimerCountDown;