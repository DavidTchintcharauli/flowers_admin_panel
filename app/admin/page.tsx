"use client";

import { useEffect, useState } from "react";
import { getUserRoleServer } from "../server/user/user.action";
import Link from "next/link";

export default function AdminDashboard() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRole() {
      const userRole = await getUserRoleServer();
      setRole(userRole);
    }
    fetchRole();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">🛠️ Admin Panel</h1>
      
      {role === "admin" && (
        <Link href="/admin/add-product">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            ➕ დაამატე პროდუქტი
          </button>
        </Link>
      )}

      {role !== "admin" && <p className="text-red-500">🚫 თქვენ არ გაქვთ ადმინ პანელზე წვდომა.</p>}
    </div>
  );
}
