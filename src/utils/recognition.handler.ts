import axios from "axios";
import { deleteImage } from "./firebase.handler";
import { faceData } from "../interfaces/recognition-service.interface";

const SERVICE_URL = process.env.SERVICE_URL as string;

const recognize = async (body: faceData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(SERVICE_URL, body, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        await deleteImage(body.unknown);
        resolve(response.data);
      })
      .catch(async (error) => {
        await deleteImage(body.unknown);
        if (error.response) {
          reject(new Error(error.response.data.error));
        } else if (error.request) {
          reject(new Error("Error connecting to service"));
        } else {
          reject(new Error("Error"));
        }
      });
  });
};

export { recognize };
