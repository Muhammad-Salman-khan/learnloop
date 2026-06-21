import { v2 as cloudinary } from "cloudinary";
import { ReturnResponse } from "../response/ReturnResponse";
import type { CloudinaryUploadType } from "./../Types/index";

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadBufferToCloudinary = async (buffer: Buffer, folder?: string) => {
  return await new Promise<CloudinaryUploadType>((resolve, reject) => {
    const uploadStreams = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) reject(error);
        if (!result) return reject(new Error("Cloudinary returned no result"));
        resolve(result as unknown as CloudinaryUploadType);
      },
    );
    uploadStreams.end(buffer);
  });
};

export const CloudinayUploadImage = async (thumbnail: File | null) => {
  try {
    const file = thumbnail;
    if (!file) {
      return ReturnResponse({
        status: 400,
        success: false,
        message: "please Upload a Image",
        error: "please Upload a Image",
      });
    }
    const bytes = await file?.arrayBuffer();
    const buffer = Buffer?.from(bytes);
    const uploadStreamsResult = await uploadBufferToCloudinary(
      buffer,
      "Lms-students",
    );
    return ReturnResponse({
      status: 200,
      success: true,
      message: "Image uploaded successfully",
      data: uploadStreamsResult,
    });
  } catch (error: any) {
    return ReturnResponse({
      status: 500,
      success: false,
      message: "Failed to upload image",
      error: error?.message || "something went wrong",
    });
  }
};
