import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';

// Disable body parsing, we'll handle it with formidable
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false, // Disable Next.js body parser
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// At the top of the file, add this to verify environment variables
console.log('Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase key configured:', !!process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting file upload process...');
    
    // Configure formidable with streaming
    const form = formidable({
      maxFileSize: 200 * 1024 * 1024, // 200MB
      keepExtensions: true,
      allowEmptyFiles: false,
      multiples: false,
      fileWriteStreamHandler: () => {
        // Use a temporary file for streaming
        const tmpFilePath = `/tmp/upload-${Date.now()}.apk`;
        return fs.createWriteStream(tmpFilePath);
      },
    });

    // Parse the form
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          reject(err);
        }
        resolve([fields, files]);
      });
    });

    const { appName, version, buildType, releaseDate, releaseNotes } = fields;
    const apkFile = files.apkFile;

    if (!apkFile || !appName || !version) {
      console.error('Missing required fields:', { apkFile: !!apkFile, appName, version });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Read file in chunks
    const fileStream = fs.createReadStream(apkFile.filepath);
    const chunks = [];

    fileStream.on('data', chunk => chunks.push(chunk));

    await new Promise((resolve, reject) => {
      fileStream.on('end', resolve);
      fileStream.on('error', reject);
    });

    const fileContent = Buffer.concat(chunks);
    console.log('File size:', fileContent.length, 'bytes');
    
    // Generate filename
    const timestamp = Date.now();
    const filename = `${appName.replace(/\s+/g, '-')}-v${version}-${timestamp}.apk`;
    console.log('Generated filename:', filename);
    
    // Upload to Supabase
    console.log('Starting Supabase upload...');
    const { data, error } = await supabase.storage
      .from('apk-files')
      .upload(filename, fileContent, {
        contentType: 'application/vnd.android.package-archive',
        cacheControl: '3600',
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    console.log('File uploaded successfully, getting public URL...');
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('apk-files')
      .getPublicUrl(filename);

    console.log('Public URL:', urlData.publicUrl);

    // Store metadata in database
    console.log('Storing metadata in database...');
    const { data: metaData, error: metaError } = await supabase
      .from('apk_metadata')
      .insert([
        {
          app_name: appName,
          version: version,
          build_type: buildType,
          release_date: releaseDate,
          release_notes: releaseNotes,
          file_path: filename,
          download_url: urlData.publicUrl,
          created_at: new Date(),
        },
      ])
      .select();

    if (metaError) {
      console.error('Database error:', metaError);
      throw metaError;
    }

    // Cleanup
    fs.unlinkSync(apkFile.filepath);

    console.log('Upload process completed successfully');
    return res.status(200).json({
      success: true,
      apk: {
        name: appName,
        version: version,
        buildType: buildType,
        releaseDate: releaseDate,
        downloadUrl: urlData.publicUrl,
        id: metaData[0].id,
      },
    });
  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      details: error.details || 'No additional details'
    });
    return res.status(500).json({ 
      error: 'Upload failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 