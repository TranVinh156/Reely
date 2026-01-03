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
      className="relative flex items-center flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <i
        className={`ri-volume-${muted ? "mute" : "up"}-fill cursor-pointer ml-2 mt-2 text-xl ${muted ? "icon-[mdi--mute]" : "icon-[mdi--volume-high]"} text-white`}
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
          className="w-24 rotate-[-90deg] cursor-pointer accent-red-500 absolute top-18 ml-2"
        />
      )}
    </div>
  );
};

export default VolumeControl;
