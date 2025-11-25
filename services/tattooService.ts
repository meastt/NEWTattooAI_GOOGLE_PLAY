import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import type { Idea } from '../types';

const IDEAS_STORAGE_KEY = 'inksync_saved_ideas';

/**
 * Fetches ideas saved by the current user from local storage.
 * @returns A promise that resolves to an array of saved ideas.
 */
export const getSavedIdeas = async (): Promise<Idea[]> => {
    try {
        const storedIdeas = localStorage.getItem(IDEAS_STORAGE_KEY);
        if (!storedIdeas) return [];

        const ideas: Idea[] = JSON.parse(storedIdeas);

        // Retrieve image data from Filesystem for each idea
        const ideasWithImages = await Promise.all(ideas.map(async (idea) => {
            try {
                if (idea.imagePath) {
                    const file = await Filesystem.readFile({
                        path: idea.imagePath,
                        directory: Directory.Data,
                        encoding: Encoding.UTF8,
                    });
                    return { ...idea, imageDataUrl: file.data as string };
                }
                return idea;
            } catch (e) {
                console.error(`Failed to load image for idea ${idea.id}`, e);
                return idea; // Return idea without image if load fails
            }
        }));

        return ideasWithImages;
    } catch (error) {
        console.error('Error fetching saved ideas:', error);
        return [];
    }
};

/**
 * Saves a new tattoo idea locally.
 * @param idea - An object containing the prompt and the base64 image data URL.
 */
export const saveIdea = async ({ prompt, imageDataUrl }: { prompt: string; imageDataUrl: string }): Promise<void> => {
    try {
        const id = Date.now().toString();
        const fileName = `tattoo_${id}.txt`; // Saving base64 string to a text file

        // Save image data to Filesystem
        await Filesystem.writeFile({
            path: fileName,
            data: imageDataUrl,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });

        // Create metadata object
        const newIdea: Idea = {
            id,
            prompt,
            imagePath: fileName,
            createdAt: new Date().toISOString(),
            // We don't store the huge base64 string in localStorage, just the path
        };

        // Update localStorage
        const storedIdeas = localStorage.getItem(IDEAS_STORAGE_KEY);
        const ideas: Idea[] = storedIdeas ? JSON.parse(storedIdeas) : [];
        ideas.unshift(newIdea); // Add to beginning
        localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));

    } catch (error) {
        console.error('Error saving idea:', error);
        throw new Error('Failed to save your idea locally. Please try again.');
    }
};

/**
 * Deletes all saved ideas and clears localStorage.
 * This function ensures complete data deletion.
 */
export const deleteUserData = async (): Promise<void> => {
    try {
        const storedIdeas = localStorage.getItem(IDEAS_STORAGE_KEY);
        if (storedIdeas) {
            const ideas: Idea[] = JSON.parse(storedIdeas);

            // Delete all image files
            await Promise.all(ideas.map(async (idea) => {
                if (idea.imagePath) {
                    try {
                        await Filesystem.deleteFile({
                            path: idea.imagePath,
                            directory: Directory.Data,
                        });
                    } catch (e) {
                        console.warn(`Failed to delete file ${idea.imagePath}`, e);
                    }
                }
            }));
        }

        // Clear localStorage metadata
        localStorage.removeItem(IDEAS_STORAGE_KEY);

        // Clear user ID and other preferences
        localStorage.removeItem('tattoo_app_user_id');
        localStorage.removeItem('tattoo_app_subscription');

        console.log('User data successfully deleted');
    } catch (error) {
        console.error('Error deleting user data:', error);
        throw new Error('Failed to delete your data. Please try again.');
    }
};
