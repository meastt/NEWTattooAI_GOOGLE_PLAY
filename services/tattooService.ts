import { supabase } from './supabaseClient';
import { getUserId } from '../utils/user';
import type { Idea } from '../types';

/**
 * Fetches tattoo ideas for the main inspiration gallery.
 * @returns A promise that resolves to an array of ideas.
 */
export const getGalleryIdeas = async (): Promise<Idea[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('gallery_ideas')
      .select('id, image_url, prompt')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching gallery ideas:', error);
    return [];
  }
};

/**
 * Fetches ideas saved by the current user.
 * @returns A promise that resolves to an array of saved ideas.
 */
export const getSavedIdeas = async (): Promise<Idea[]> => {
    if (!supabase) return [];
    const userId = getUserId();
    try {
      const { data, error } = await supabase
        .from('saved_ideas')
        .select('id, image_data_url, prompt')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
  
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching saved ideas:', error);
      return [];
    }
  };

/**
 * Saves a new tattoo idea for the current user.
 * @param idea - An object containing the prompt and the base64 image data URL.
 */
export const saveIdea = async ({ prompt, imageDataUrl }: { prompt: string; imageDataUrl: string }): Promise<void> => {
    if (!supabase) {
        alert('Database not configured. Could not save idea.');
        return;
    }
    const userId = getUserId();
    try {
        const { error } = await supabase
        .from('saved_ideas')
        .insert({
            user_id: userId,
            prompt: prompt,
            image_data_url: imageDataUrl,
        });

        if (error) throw error;
    } catch (error) {
        console.error('Error saving idea:', error);
        throw new Error('Failed to save your idea. Please try again.');
    }
};

/**
 * Admin function to add gallery images (temporary - for adding new images)
 */
export const addGalleryImages = async (): Promise<void> => {
  if (!supabase) {
    console.error('Database not configured');
    return;
  }

  const galleryImages = [
    {
      image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_33PM.jpeg',
      prompt: ''
    },
    {
      image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_34PM%20(1).jpeg',
      prompt: ''
    },
    {
      image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_34PM.jpeg',
      prompt: ''
    },
    {
      image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_37PM.jpeg',
      prompt: ''
    },
    {
      image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_47PM.jpeg',
      prompt: ''
    },
    {
      image_url: 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_50PM.jpeg',
      prompt: ''
    }
  ];

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
  } catch (error) {
    console.error('Failed to add gallery images:', error);
  }
};

/**
 * Deletes all saved ideas for the current user and clears localStorage.
 * This function ensures complete data deletion for App Store compliance.
 */
export const deleteUserData = async (): Promise<void> => {
    if (!supabase) {
        throw new Error('Database not configured. Could not delete data.');
    }
    
    const userId = getUserId();
    
    try {
        // Delete all saved ideas for the current user
        const { error } = await supabase
            .from('saved_ideas')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
        
        // Clear localStorage (this will also clear the user ID)
        localStorage.clear();
        
        console.log('User data successfully deleted');
    } catch (error) {
        console.error('Error deleting user data:', error);
        throw new Error('Failed to delete your data. Please try again.');
    }
};
