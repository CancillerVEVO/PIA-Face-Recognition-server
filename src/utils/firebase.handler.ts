import firebaseConfig from "../config/firebase.config";
import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

initializeApp(firebaseConfig);
const storage = getStorage();

const uploadImage = (file: any, path: string) => {
  return new Promise<string>((resolve, reject) => {
    const storageRef = ref(storage, `${path}/` + uuidv4() + ".jpg");
    const uploadTask = uploadBytesResumable(storageRef, file.buffer, {
      contentType: file.mimetype,
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done 🟠");

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused 🟡");
            break;
          case "running":
            console.log("Upload is running 🟢");
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

const deleteImage = (url: string) => {
  return new Promise<void>((resolve, reject) => {
    const storageRef = ref(storage, url);

    deleteObject(storageRef)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.log(error);
        reject(new Error("Error deleting file"));
      });
  });
};

const checkImageExists = (filePath: string) => {
  return new Promise<boolean>((resolve, reject) => {
    const storageRef = ref(storage, filePath);

    getDownloadURL(storageRef)
      .then((url) => {
        resolve(true);
      })
      .catch((error) => {
        if (error.code === "storage/object-not-found") {
          resolve(false);
        } else {
          console.log(error);
          reject(new Error("Error checking file"));
        }
      });
  });
};

export { uploadImage, deleteImage, checkImageExists };
