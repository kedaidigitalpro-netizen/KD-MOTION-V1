import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 🔥 ambil body dari frontend
    const body = await req.json();

    // 🔥 bersihkan email (ANTI ERROR TOTAL)
    const cleanEmail = (body.email || '')
      .toLowerCase()
      .replace(/['"]/g, '')   // hapus ' dan "
      .replace(/\s+/g, '')    // hapus semua spasi
      .trim();

    console.log('INPUT EMAIL:', cleanEmail);

    // ❗ GANTI DENGAN LINK CSV KAMU
    const url =
      'https://docs.google.com/spreadsheets/d/1lrE1HFbsJcFU4C2MpC_psgoSJjTGSCqsp3opm_rPQDA/export?format=csv';

    // 🔥 fetch CSV dari Google Sheet
    const res = await fetch(url, {
      cache: 'no-store',
    });

    const text = await res.text();

    console.log('CSV RAW:', text.slice(0, 200));

    // 🔥 parsing CSV → ambil kolom A (email)
    const emails = text
      .split('\n')
      .map((row) => row.split(',')[0]) // ambil kolom A
      .map((e) =>
        e
          .replace(/"/g, '')
          .replace(/\r/g, '')
          .replace(/\s+/g, '')
          .toLowerCase()
      )
      .filter((e) => e.includes('@'));

    console.log('EMAIL LIST SAMPLE:', emails.slice(0, 100000));

    // 🔥 validasi email
    const allowed = emails.some((e) => e === cleanEmail);

    console.log('MATCH RESULT:', allowed);

    // 🔥 response ke frontend
    return NextResponse.json({ allowed });
  } catch (err) {
    console.error('API LOGIN ERROR:', err);
    return NextResponse.json({ allowed: false });
  }
}