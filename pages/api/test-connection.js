import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    // Test database connection
    const { data: dbTest, error: dbError } = await supabase
      .from('apk_metadata')
      .select('id', { count: 'exact' }); // Changed to select 'id' instead of '*'

    if (dbError) throw dbError;

    // Test storage connection
    const { data: storageTest, error: storageError } = await supabase
      .storage
      .from('apk-files')
      .list();

    if (storageError) throw storageError;

    // Safe access to count property
    const count = dbTest?.count ?? 0;

    res.status(200).json({
      success: true,
      database: 'connected',
      storage: 'connected',
      dbResult: { count },
      storageResult: storageTest?.length ?? 0,
      debug: {
        hasDbData: !!dbTest,
        dbTestType: typeof dbTest,
        dbTestValue: dbTest,
        hasStorageData: !!storageTest,
      }
    });
  } catch (error) {
    console.error('Connection test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error,
      debug: {
        supabaseUrlConfigured: !!supabaseUrl,
        supabaseKeyConfigured: !!supabaseKey,
      }
    });
  }
} 