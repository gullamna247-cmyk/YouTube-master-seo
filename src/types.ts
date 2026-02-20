import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Video {
  id: number;
  youtube_id: string;
  title: string;
  description: string;
  thumbnail: string;
  category_id: number;
  category_name: string;
  views: number;
  likes: number;
  published_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  published_at: string;
}

export interface Comment {
  id: number;
  video_id: number;
  user_name: string;
  content: string;
  created_at: string;
}
