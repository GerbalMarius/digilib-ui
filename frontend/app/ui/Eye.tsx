import { MouseEventHandler } from "react";
import Image from "next/image";

interface EyeProps {
  isClosed?: boolean;
  onClickAction?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  width: number;
  height: number;
}

const Eye = ({ isClosed = true, onClickAction, className = "", width, height }: EyeProps) => {
  return (
    <button
      type="button"
      onClick={onClickAction}
      aria-label={isClosed ? "Show password" : "Hide password"}
      className={`
         transform transition-transform duration-200
         hover:scale-110 active:scale-95
         absolute inset-y-0 right-0 px-3 flex items-center justify-center ${className}`}
    >
      <Image
        src={isClosed ? "/img/eye-open.svg" : "/img/eye-closed.svg"}
        alt=""
        width={width}
        height={height}
        className={`pointer-events-none transition-all duration-200
                    ${isClosed ? "opacity-80 scale-100" : "opacity-60 scale-90"}`}
      />
    </button>
  );
};

export default Eye;
