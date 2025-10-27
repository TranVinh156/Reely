import React from "react";

interface VolumeControlProps {
  muted: boolean;
  volume: number;
  setVol: (volume: number) => void;
  toggleMute: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  muted,
  volume,
  setVol,
  toggleMute,
}) => {
  const [hover, setHover] = React.useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <i
        className={`ri-volume-${muted ? "mute" : "up"}-fill cursor-pointer text-xl text-white icon-[mdi--mute]`}
        onClick={toggleMute}
      />
      {hover && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVol(Number(e.target.value))}
          className="absolute -top-16 w-24 rotate-[-90deg] cursor-pointer accent-red-500"
        />
      )}
    </div>
  );
};

export default VolumeControl;
