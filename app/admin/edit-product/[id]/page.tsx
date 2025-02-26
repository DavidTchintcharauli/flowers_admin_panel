"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById } from "../../../server/product/getProductById";
import { updateProduct } from "../../../server/product/updateProduct";
import { createClient } from "../../../utils/supabase/client";
import Image from "next/image";

const supabase = createClient();

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [product, setProduct] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [role, setRole] = useState<string>("user");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const data = await getProductById(id as string);
      if (data) {
        setProduct(data);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price.toString());
        setImageUrl(data.image_url);
      }
      setLoading(false);
    };

    const fetchUserRole = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user) {
        setRole("guest");
        return;
      }

      const { data: roleData } = await supabase
        .from("roles")
        .select("role")
        .eq("id", user.user.id)
        .single();

      setRole(roleData?.role ?? "user");
    };

    fetchProduct();
    fetchUserRole();
  }, [id]);

  const uploadImage = async () => {
    if (!imageFile) return;
    
    if (role !== "admin") {
      setMessage("⛔ თქვენ არ გაქვთ ფოტოს ატვირთვის უფლება.");
      return;
    }

    setUploading(true);
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `products/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("flowers")
      .upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      setMessage(`❌ ატვირთვის შეცდომა: ${error.message}`);
      setUploading(false);
      return;
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/flowers/${fileName}`;
    setImageUrl(publicUrl);
    setUploading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (role !== "admin") {
      setMessage("⛔ მხოლოდ `admin`-ს შეუძლია პროდუქტის რედაქტირება.");
      return;
    }

    const response = await updateProduct(id as string, {
      name,
      description,
      price: parseFloat(price),
      image_url: imageUrl,
    });

    if (response.error) {
      setMessage(`❌ შეცდომა: ${response.error}`);
    } else {
      setMessage("✅ წარმატება! პროდუქტი განახლდა.");
      router.push("/admin/products");
    }
  };

  if (loading) return <p className="text-center text-gray-500">⏳ იტვირთება...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">✏️ რედაქტირება: {product?.name}</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      
      {role === "admin" ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="პროდუქტის სახელი"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="აღწერა"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="ფასი"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex flex-col items-center gap-3">
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              📷 აირჩიე ფოტო
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} />
            </label>

            {imageFile && (
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={uploadImage}
                disabled={uploading}
              >
                {uploading ? "⏳ ატვირთვა..." : "☁️ ატვირთე ფოტო"}
              </button>
            )}

            {imageUrl && (
              <Image src={imageUrl} alt="Uploaded" width={100} height={100} className="rounded-md object-cover" />
            )}
          </div>

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
            💾 განახლება
          </button>
        </form>
      ) : (
        <p className="text-red-500 text-center">⛔ თქვენ არ გაქვთ წვდომა პროდუქტის რედაქტირებაზე.</p>
      )}
    </div>
  );
}
