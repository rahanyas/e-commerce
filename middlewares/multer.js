import multer from "multer";

const storage = multer.memoryStorage();

const Upload = multer({storage}).single('file');

export default Upload;