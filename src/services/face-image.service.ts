import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import firebaseConfig from "../config/firebase.config";
import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

initializeApp(firebaseConfig);
const storage = getStorage();
const prisma = new PrismaClient();

const uploadFaceData = (file: any) => {
  return new Promise<string>((resolve, reject) => {
    const storageRef = ref(storage, "users/" + uuidv4() + ".jpg");
    const uploadTask = uploadBytesResumable(storageRef, file.buffer, {
      contentType: file.mimetype,
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done ⏳🟠");

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused ⏸🟡");
            break;
          case "running":
            console.log("Upload is running ⏯🟢");
            break;
        }
      },
      (error) => {
        console.log(error);
        reject(new Error("Error uploading file"));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            console.log(error);
            reject(new Error("Error getting download URL"));
          });
      }
    );
  });
};

const saveFaceData = async (file: any, id: string) => {
  const url = await uploadFaceData(file);

  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      imageUrl: url,
    },
  });

  const cleanUser = {
    id: updatedUser.id,
    imageUrl: updatedUser.imageUrl,
  };

  return cleanUser;
};
export { uploadFaceData, saveFaceData };
