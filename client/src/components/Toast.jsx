import React, { useEffect } from "react";
import { BsCheckCircleFill } from "react-icons/bs";

const Toast = ({ message, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      role='status'
      className='fixed top-5 right-5 z-[60] flex items-center gap-2 bg-primary border border-[#66666645] text-ascent-1 px-4 py-3 rounded-lg shadow-xl'
    >
      <BsCheckCircleFill className='text-[#0444a4] text-lg shrink-0' />
      <span className='text-sm font-medium'>{message}</span>
    </div>
  );
};

export default Toast;
