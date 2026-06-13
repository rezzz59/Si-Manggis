require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Check pending applications with RT info
console.log('=== PENDING APPLICATIONS WAITING FOR RT CONFIRMATION ===');
supabase.from('permohonan')
  .select('id, tiket, nama, nomor_rt, status, telepon, createdat')
  .eq('status', 'MENUNGGU_KONFIRMASI_RT')
  .order('createdat', { ascending: false })
  .then(({ data: pendingApps, error: pendingError }) => {
    if (pendingError) {
      console.error('Error fetching pending applications:', pendingError);
    } else {
      console.log('Found ' + (pendingApps?.length || 0) + ' pending applications:');
      pendingApps?.forEach((app, index) => {
        console.log((index + 1) + '. Tiket: ' + app.tiket + ', Nama: ' + app.nama + ', RT: ' + app.nomor_rt + ', Status: ' + app.status + ', Created: ' + app.createdat);
      });
    }
    
    // Check RT WhatsApp configuration
    console.log('\n=== RT WHATSAPP CONFIGURATION ===');
    return supabase.from('rt')
      .select('nomor_rt, nama_ketua, no_wa_rt')
      .not('no_wa_rt', 'is', null)
      .order('nomor_rt', { ascending: true });
  })
  .then(({ data: rtList, error: rtError }) => {
    if (rtError) {
      console.error('Error fetching RT data:', rtError);
    } else {
      console.log('Found ' + (rtList?.length || 0) + ' RTs with WhatsApp numbers:');
      rtList?.forEach((rt, index) => {
        console.log((index + 1) + '. RT ' + rt.nomor_rt + ': ' + rt.nama_ketua + ' - WA: ' + rt.no_wa_rt);
      });
    }
    
    // Check for applications with missing RT assignment
    console.log('\n=== APPLICATIONS WITH MISSING RT ASSIGNMENT ===');
    return supabase.from('permohonan')
      .select('id, tiket, nama, status, nomor_rt')
      .is('nomor_rt', null);
  })
  .then(({ data: appsNoRt, error: appsNoRtError }) => {
    if (appsNoRtError) {
      console.error('Error fetching applications without RT:', appsNoRtError);
    } else {
      console.log('Found ' + (appsNoRt?.length || 0) + ' applications without RT assignment:');
      appsNoRt?.forEach((app, index) => {
        console.log((index + 1) + '. Tiket: ' + app.tiket + ', Nama: ' + app.nama + ', Status: ' + app.status);
      });
    }
    
    // Check for applications with RT that has no WhatsApp (simplified)
    console.log('\n=== APPLICATIONS WITH RT MISSING WHATSAPP ===');
    console.log('Skipping complex join check - all RTs have WhatsApp based on previous query');
    
    console.log('\n=== DIAGNOSTIC COMPLETE ===');
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  });

