import { supabase } from '../supabaseClient.js';
import multer from 'multer';

// Use multer to handle file uploads from requests
const upload = multer({ storage: multer.memoryStorage() });

export const uploadFile = [
  upload.single('file'), // expecting form-data with "file"
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'No file uploaded' });

      // Upload to Supabase bucket (e.g., "uploads")
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(`files/${Date.now()}-${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('uploads')
        .getPublicUrl(data.path);

      res.json({ message: 'File uploaded successfully', url: publicUrl.publicUrl });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];
