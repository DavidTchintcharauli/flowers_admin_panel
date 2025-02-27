"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-16 left-64 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-md"
    >
      ⬅️ უკან დაბრუნება
    </button>
  );
}
