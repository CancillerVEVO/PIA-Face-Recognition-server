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
        console.log("Upload is " + progress + "% done");

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
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
            console.log("File available at ", downloadURL);
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

export { uploadFaceData };
