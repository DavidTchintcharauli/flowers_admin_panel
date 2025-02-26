"use client";

import { useEffect, useState } from "react";
import { getProducts } from "../../server/product/getProducts";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "../../server/product/deleteProduct";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

type Product = {
  image_url: string;
  id: string;
  name: string;
  description: string;
  price: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteProductId) return;
    
    const response = await deleteProduct(deleteProductId);
    
    if (response.error) {
      alert(`❌ შეცდომა: ${response.error}`);
    } else {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== deleteProductId));
    }

    setDeleteProductId(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 პროდუქტების მართვა</h1>
        <Link href="/admin/add-product">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-md">
            ➕ დაამატე პროდუქტი
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">📸 ფოტო</th>
              <th className="border p-3 text-left">📜 დასახელება</th>
              <th className="border p-3 text-left">📄 აღწერა</th>
              <th className="border p-3 text-left">💲 ფასი</th>
              <th className="border p-3 text-center">⚡ ქმედებები</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="border p-3 h-12 w-24 bg-gray-200 rounded-md"></td>
                  <td className="border p-3 h-12 bg-gray-200 rounded-md"></td>
                  <td className="border p-3 h-12 bg-gray-200 rounded-md"></td>
                  <td className="border p-3 h-12 bg-gray-200 rounded-md"></td>
                  <td className="border p-3 h-12 bg-gray-200 rounded-md"></td>
                </tr>
              ))
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="border p-3 text-left">
                    <Image
                      src={product.image_url || "/fallback.jpg"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </td>
                  <td className="border p-3">{product.name}</td>
                  <td className="border p-3">{product.description}</td>
                  <td className="border p-3 text-green-600 font-bold">
                    ${product.price}
                  </td>
                  <td className="border p-3">
                    <div className="flex items-center gap-3 justify-center">
                      <Link href={`/admin/edit-product/${product.id}`}>
                        <Pencil className="text-blue-500 hover:text-blue-700 cursor-pointer" size={20} />
                      </Link>
                      <button
                        onClick={() => setDeleteProductId(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 p-4">
                  ❌ ჯერ პროდუქტი არ არის დამატებული.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDeleteModal
        isOpen={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        onConfirm={handleDeleteConfirm}
        title="პროდუქტის წაშლა"
        message="დარწმუნებული ხარ, რომ გინდა წაშალო ეს პროდუქტი?"
      />
    </div>
  );
}
