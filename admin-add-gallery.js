// Quick admin script to add gallery images to Supabase
// Run this once to populate the gallery_ideas table

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zflkdyuswpegqabkwlgw.supabase.co';
// You'll need to replace this with your actual service role key or anon key
const supabaseKey = 'your-supabase-key-here';

const supabase = createClient(supabaseUrl, supabaseKey);

const galleryImages = [
  {
    image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_33PM.jpeg',
    prompt: 'Artistic tattoo design'
  },
  {
    image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_34PM%20(1).jpeg',
    prompt: 'Creative tattoo concept'
  },
  {
    image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_34PM.jpeg',
    prompt: 'Unique tattoo inspiration'
  },
  {
    image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_37PM.jpeg',
    prompt: 'Modern tattoo design'
  },
  {
    image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_47PM.jpeg',
    prompt: 'Beautiful tattoo artwork'
  },
  {
    image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_50PM.jpeg',
    prompt: 'Stunning tattoo creation'
  }
];

async function addGalleryImages() {
  try {
    console.log('Adding gallery images to database...');
    
    const { data, error } = await supabase
      .from('gallery_ideas')
      .insert(galleryImages);
    
    if (error) {
      console.error('Error inserting images:', error);
      return;
    }
    
    console.log('Successfully added', galleryImages.length, 'gallery images!');
    console.log('Data:', data);
  } catch (error) {
    console.error('Failed to add gallery images:', error);
  }
}

addGalleryImages();