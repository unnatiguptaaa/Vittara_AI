import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
  const isTxt = file.mimetype === 'text/plain' || file.originalname.toLowerCase().endsWith('.txt');

  if (isPdf || isTxt) {
    cb(null, true);
  } else {
    const err = new Error('Supported formats: PDF, TXT.');
    err.code = 'UNSUPPORTED_FILE_TYPE';
    cb(err, false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

export function handleUploadErrors(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Please upload a smaller document.'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Supported formats: PDF, TXT.'
    });
  }
  next();
}
