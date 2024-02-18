import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URI as string; 
const dbName = 'inter'; 
const collectionName = 'pdf'; 

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertOne({
      filename: file.name,
      contentType: file.type,
      data: buffer,
    });

    await client.close();

    console.log("hogaya");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
