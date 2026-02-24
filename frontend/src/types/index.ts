export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  cover?: string;
  category: string;
  views: number;
  status?: number;
  date?: string;
  createdAt?: string;
  tags?: string[];
}

export interface Moment {
  id: number;
  content: string;
  images?: string[];
  likes: number;
  time?: string;
  createdAt?: string;
}
export interface FriendLink {
  id: number;
  name: string;
  avatar: string;
  url: string;
  description: string;
  status?: number;
}
export interface GalleryImage {
  id: number;
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  createdAt?: string;
}
export interface Comment {
  id: number;
  content: string;
  author: string;
  email?: string;
  articleId?: number;
  momentId?: number;
  parentId?: number;
  createdAt?: string;
}
export interface TimelineItem {
  year: string;
  events: string[];
}
