import { v2 as cloudinary } from "cloudinary";
import { ReturnResponse } from "@/lib/response/ReturnResponse";

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = async (buffer: Buffer, folder?: string) => {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) {
          return reject(new Error("Cloudinary returned no result"));
        }
        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};

export const CloudinayUploadImage = async (thumbnail: File | null) => {
  try {
    const file = thumbnail;
    if (!file) {
      return ReturnResponse({
        status: 400,
        success: false,
        message: "Please upload an image",
        error: "thumbnail_missing",
      });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadBufferToCloudinary(buffer, "lms-students");
    return ReturnResponse({
      status: 200,
      success: true,
      message: "Image uploaded successfully",
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "something went wrong";
    return ReturnResponse({
      status: 500,
      success: false,
      message: "Failed to upload image",
      error: message,
    });
  }
};

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  duration?: number;
  format: string;
  bytes: number;
  width: number;
  height: number;
};
