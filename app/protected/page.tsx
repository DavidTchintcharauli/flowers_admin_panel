"use client";

import { useRole } from "../context/RoleContext";

export default function ProtectedPage() {
  const role = useRole();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-6">🌺 Flower Shop Admin Panel</h1>

          <p className="mt-4 text-gray-700">
            🎉 კეთილი იყოს თქვენი მობრძანება ჩვენს ონლაინ მაღაზიის ადმინ პანელში!
          </p>
        </div>
      </div>
    </div>
  );
}
