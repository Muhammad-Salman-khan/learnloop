import { v2 as cloudinary } from "cloudinary";
import { ReturnResponse } from "../response/ReturnResponse";
import type { CloudinaryUploadType } from "./../Types/index";

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CloudinayUploadImage = async (thumbnail: File | null) => {
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
    const buffer = Buffer.from(bytes);
    await new Promise<CloudinaryUploadType>((req, res) => {});
  } catch (error: any) {
    console.error(error);
  }
};
