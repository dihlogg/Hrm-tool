import axios from "axios";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "./apiService";

export const uploadImageToCloudinary = async (
  file: File,
  folder: string = "general",
) => {
  try {
    const signResponse = await axiosInstance.post(
      API_ENDPOINTS.GET_CLOUDINARY_SIGNATURE,
      {
        folder,
      },
    );
    const { timestamp, signature, apiKey } = signResponse.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
    );

    return res.data.secure_url as string;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
