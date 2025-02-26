import { getProducts } from "../../server/product/getProducts";
import Link from "next/link";
import Image from "next/image";

export default async function AdminProductsPage() {
  const products = await getProducts();

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
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">ფოტო</th>
              <th className="border p-3">დასახელება</th>
              <th className="border p-3">აღწერა</th>
              <th className="border p-3">ფასი</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border p-3 text-center">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
