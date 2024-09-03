import { fileController } from "../controllers/fileController.js";

export const fileRoutes = [
    {
        method: "post",
        path: "/uploadFile",
        uploadFiles: true,
        controller: fileController.uploadFile,
    },
];


