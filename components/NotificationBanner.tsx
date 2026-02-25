"use client";

import { useEffect } from "react";

type Props = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
};

export default function NotificationBanner({
  message,
  type = "success",
  onClose,
  duration = 15000,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-20 left-5 z-50 animate-slideIn">
      <div
        className={`px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
      >
        {message}
      </div>
    </div>
  );
}