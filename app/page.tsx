"use client";

import { useEffect, useState } from "react";
import { getUserRoleServer } from "./server/user/user.action";
import Link from "next/link";



export default async function Home() {

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRole() {
      const userRole = await getUserRoleServer();
      setRole(userRole);
    }
    fetchRole();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">🌺 Flower Shop</h1>

        {role === "admin" && (
          <Link href="/admin">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              🔧 Admin Panel
            </button>
          </Link>
        )}

        <p className="mt-4 text-gray-700">🎉 კეთილი იყოს თქვენი მობრძანება ჩვენს ონლაინ მაღაზიაში!</p>
      </div>
    </>
  );
}
