import { db } from '@/db';
import { images } from '@/db/schema';

async function main() {
    // Create minimal PNG data for testing
    const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const minimalPng = Buffer.concat([
        pngHeader,
        Buffer.from('IHDR', 'ascii'),
        Buffer.alloc(16, 0) // Minimal PNG content for testing
    ]);

    // Create minimal JPEG data for testing
    const jpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);
    const minimalJpeg = Buffer.concat([
        jpegHeader,
        Buffer.from('JFIF', 'ascii'),
        Buffer.alloc(20, 0) // Minimal JPEG content for testing
    ]);

    // Create minimal SVG data for testing
    const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>';
    const svgBuffer = Buffer.from(svgContent, 'utf-8');

    const sampleImages = [
        {
            filename: 'test-image-1.png',
            contentType: 'image/png',
            data: minimalPng,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            filename: 'avatar.jpg',
            contentType: 'image/jpeg',
            data: minimalJpeg,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            filename: 'logo.svg',
            contentType: 'image/svg+xml',
            data: svgBuffer,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
    ];

    await db.insert(images).values(sampleImages);
    
    console.log('✅ Images seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});