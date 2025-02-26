"use client";

import { useState } from "react";
import { addProduct } from "../../server/product/addProduct";
import { createClient  } from "../../utils/supabase/client";

const supabase = createClient();

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return;

    setUploading(true);
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("flowers")
      .upload(`products/${fileName}`, imageFile);

    if (error) {
      setMessage(`❌ ატვირთვის შეცდომა: ${error.message}`);
      setUploading(false);
      return;
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/flowers/products/${fileName}`;
    setImageUrl(publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!imageUrl) {
      return setMessage("❌ ფოტოს ატვირთვა აუცილებელია!");
    }

    const response = await addProduct(name, description, parseFloat(price), imageUrl);

    if (response.error) {
      setMessage(`❌ შეცდომა: ${response.error}`);
    } else {
      setMessage(`✅ წარმატება: ${response.success}`);
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setImageFile(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">➕ დაამატე პროდუქტი</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
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
            <img src={imageUrl} alt="Uploaded" className="w-32 h-32 object-cover mt-2 rounded" />
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          ➕ დაამატე პროდუქტი
        </button>
      </form>
    </div>
  );
}
