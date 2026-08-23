require('dotenv').config();
const { Pool } = require('pg');

async function fix() {
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL found');
    return;
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  
  const res = await pool.query('SELECT id, image_url FROM generated_thumbnails');
  console.log(`Found ${res.rows.length} records`);

  for (const row of res.rows) {
    if (row.image_url.includes('ar_1_1') || row.image_url.includes('ar_16_9')) {
      const fixedUrl = row.image_url
        .replace('ar_1_1,c_fill,g_auto/h_1080,w_1080/f_auto,q_auto/v1/', 'ar_1:1,c_fill,g_auto,f_auto,q_auto/v1787454105/')
        .replace('ar_16_9,c_fill,g_auto/h_720,w_1280/f_auto,q_auto/v1/', 'ar_16:9,c_fill,g_auto,f_auto,q_auto/v1787453532/');
      
      await pool.query('UPDATE generated_thumbnails SET image_url = $1 WHERE id = $2', [fixedUrl, row.id]);
      console.log(`Updated row ${row.id}`);
    }
  }

  await pool.end();
  console.log('Finished fixing URLs');
}

fix().catch(console.error);
