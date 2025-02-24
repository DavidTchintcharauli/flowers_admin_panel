"use client";

import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { useRole } from "../context/RoleContext"; // ⬅️ Context-დან როლის მიღება

export default function ProtectedPage() {
  const role = useRole(); // ⬅️ "role" წამოგვაქვს Context-იდან

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          ეს არის დაცული გვერდი, რომელსაც მხოლოდ ავტორიზებული მომხმარებლები ხედავენ
        </div>
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-6">🌺 Flower Shop</h1>

          {role === "admin" ? (
            <Link href="/admin">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                🔧 Admin Panel
              </button>
            </Link>
          ) : (
            <div className="text-red-500">❌ There is no admin role</div>
          )}

          <p className="mt-4 text-gray-700">
            🎉 კეთილი იყოს თქვენი მობრძანება ჩვენს ონლაინ მაღაზიაში!
          </p>
        </div>
      </div>
    </div>
  );
}
