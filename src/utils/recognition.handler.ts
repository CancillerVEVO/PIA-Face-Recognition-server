import axios from "axios";
import { deleteImage } from "./firebase.handler";
import { faceData } from "../interfaces/recognition-service.interface";

const SERVICE_URL = process.env.SERVICE_URL as string;

const recognize = async (
  body: faceData
): Promise<{ message: string; status: number }> => {
  return new Promise((resolve, reject) => {
    axios
      .post(SERVICE_URL, body, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        await deleteImage(body.unknown);
        resolve({ message: "Succes", status: response.status });
      })
      .catch(async (error) => {
        await deleteImage(body.unknown);
        if (error.response) {
          resolve({
            message: "Face data does not match with any user",
            status: error.response.status,
          });
        } else if (error.request) {
          reject(new Error("Error connecting to service"));
        } else {
          reject(new Error("Error"));
        }
      });
  });
};

export { recognize };
