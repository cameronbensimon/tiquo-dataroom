import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    const { blobs } = await list();
    
    // Filter and organize the images
    const deckImages = blobs.filter(blob => 
      blob.pathname.toLowerCase().includes('tiquo deck') || 
      blob.pathname.toLowerCase().includes('deck')
    ).sort((a, b) => a.pathname.localeCompare(b.pathname));
    
    const brandImages = blobs.filter(blob => 
      blob.pathname.toLowerCase().includes('brand identity') ||
      blob.pathname.toLowerCase().includes('tiquo brand') ||
      blob.pathname.toLowerCase().includes('brand-identity')
    ).sort((a, b) => a.pathname.localeCompare(b.pathname));
    
    return NextResponse.json({
      success: true,
      data: {
        deckImages: deckImages.map((blob, index) => ({
          id: index + 1,
          src: blob.url,
          alt: `TIQUO Investor Presentation Slide ${index + 1}`,
          filename: blob.pathname
        })),
        brandImages: brandImages.map((blob, index) => ({
          id: index + 1,
          src: blob.url,
          alt: `TIQUO Brand Identity Guide Page ${index + 1}`,
          filename: blob.pathname
        })),
        allBlobs: blobs.map(blob => ({
          url: blob.url,
          pathname: blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt
        }))
      }
    });
  } catch (error) {
    console.error('Error listing blob files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list blob files' },
      { status: 500 }
    );
  }
}
