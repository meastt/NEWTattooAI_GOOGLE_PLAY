export type View = 'home' | 'create' | 'saved' | 'tryOn' | 'generator' | 'removal' | 'privacy' | 'disclaimer' | 'settings';

export type TattooStyle = 'American Traditional' | 'Japanese Irezumi' | 'Fine Line' | 'Neo-Traditional' | 'Tribal' | 'Realism' | 'Blackwork';
export type TattooColor = 'Full Color' | 'Black and Grey' | 'Outline Only';

export interface Idea {
  id: number;
  image_url?: string;
  image_data_url?: string;
  prompt: string;
}
