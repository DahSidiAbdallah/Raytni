import { Timestamp } from 'firebase/firestore';

// Interface for post data as stored in Firestore
export interface Post {
  id: string;
  title: string;
  description: string;
  category: string; // Main category (e.g., "personne", "objet", "animal")
  subCategory: string; // Subcategory (e.g., "Enfant", "Téléphone", "Chien")
  locationName: string; // City name
  imageUrl?: string;
  status: 'lost' | 'found';
  dateTimeLostOrFound?: string;
  contactName: string;
  contactPhone: string;
  createdAt: Timestamp;
}

// Interface for post data when creating a new post
export interface PostInput {
  title: string;
  description: string;
  mainCategory: string; 
  subCategory: string;
  locationName: string;
  imageFile?: File | null;
  status: 'lost' | 'found';
  dateTimeLostOrFound?: string;
  contactName: string;
  contactPhone: string;
}

// Interface for filtering posts
export interface PostFilter {
  category?: string;
  status?: 'lost' | 'found';
  locationName?: string;
  searchTerm?: string;
}

// Interface for display posts in UI components
export interface DisplayPost {
  id: string;
  type: string; // Maps to category for UI components
  category: string; // Maps to subCategory for UI components
  title: string;
  description: string;
  location: string; // Maps to locationName for UI components
  dateTime: string; // Maps to dateTimeLostOrFound or createdAt for UI components
  contactName: string;
  contactPhone: string;
  status: string;
  createdAt: string;
  imageUrl?: string;
}

// Function to convert a Post to a DisplayPost
export const mapPostToDisplayPost = (post: Post): DisplayPost => {
  return {
    id: post.id,
    type: post.category,
    category: post.subCategory,
    title: post.title,
    description: post.description,
    location: post.locationName,
    dateTime: post.dateTimeLostOrFound || post.createdAt.toDate().toISOString(),
    contactName: post.contactName,
    contactPhone: post.contactPhone,
    status: post.status,
    createdAt: post.createdAt.toDate().toISOString(),
    imageUrl: post.imageUrl
  };
};