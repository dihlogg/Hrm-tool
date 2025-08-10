// "use client";

// import { uploadImageToCloudinary } from "@/services/cloudinaryService";
// import { useState } from "react";

// export default function UploadImage({ onUploaded }: { onUploaded: (url: string) => void }) {
//   const [loading, setLoading] = useState(false);
//   const [preview, setPreview] = useState<string | null>(null);

//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);

//     try {
//       const url = await uploadImageToCloudinary(file);
//       setPreview(url);
//       onUploaded(url);
//     } catch (err) {
//       console.error("Upload failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleUpload} />
//       {loading && <p>Đang tải ảnh...</p>}
//       {preview && <img src={preview} alt="Preview" width={200} />}
//     </div>
//   );
// }
