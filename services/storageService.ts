// services/storageService.ts
import { supabase } from './supabaseClient';

export const uploadImage = async (base64Data: string, fileName: string) => {
    // Convert base64 to blob
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();
    
    const { data, error } = await supabase.storage
        .from('user-uploads')
        .upload(`${Date.now()}_${fileName}`, blob, {
            contentType: 'image/png',
            cacheControl: '3600'
        });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(data.path);
    
    return publicUrl;
};