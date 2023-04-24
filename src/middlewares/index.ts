import { registerMiddleware, loginMiddleware } from "./auth.middleware";
import { checkJWT } from "./session.middleware";
import { uploadMiddleware } from "./face-image.middleware";

export { registerMiddleware, loginMiddleware, checkJWT, uploadMiddleware };
