import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('apk_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      apks: data.map(item => ({
        id: item.id,
        name: item.app_name,
        version: item.version,
        buildType: item.build_type,
        releaseDate: item.release_date,
        releaseNotes: item.release_notes,
        downloadUrl: item.download_url,
        createdAt: item.created_at,
      })),
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch APKs', details: error.message });
  }
} 