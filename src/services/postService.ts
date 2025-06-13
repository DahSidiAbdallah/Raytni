import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  limit,
  startAfter,
  DocumentReference,
  getDoc,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

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

export interface PostFilter {
  category?: string;
  status?: 'lost' | 'found';
  locationName?: string;
  searchTerm?: string;
}

const POSTS_PER_PAGE = 10;

/**
 * Creates a new post in the database
 */
export const createPost = async (postData: PostInput): Promise<string> => {
  try {
    let imageUrl = '';
    if (postData.imageFile) {
      const imagePath = `posts_images/${Date.now()}-${postData.imageFile.name}`;
      const imageRef = ref(storage, imagePath);
      await uploadBytes(imageRef, postData.imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const postToSave = {
      title: postData.title,
      description: postData.description,
      category: postData.mainCategory,
      subCategory: postData.subCategory,
      locationName: postData.locationName,
      imageUrl: imageUrl,
      status: postData.status,
      dateTimeLostOrFound: postData.dateTimeLostOrFound || null,
      contactName: postData.contactName,
      contactPhone: postData.contactPhone,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'posts'), postToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
};

/**
 * Fetches a single post by ID
 */
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const docRef = doc(db, 'posts', postId); // FIXED: use doc, not collection
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt as Timestamp
      } as Post;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
};

/**
 * Fetches all posts with optional filtering
 */
export const getPosts = async (filters?: PostFilter): Promise<Post[]> => {
  try {
    let postsQuery = collection(db, 'posts');
    let constraints = [];

    // Add filters if provided
    if (filters) {
      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters.locationName) {
        constraints.push(where('locationName', '==', filters.locationName));
      }
    }

    // Always order by createdAt in descending order
    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(postsQuery, ...constraints);
    const querySnapshot = await getDocs(q);

    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Skip posts that don't match the search term if one is provided
      if (filters?.searchTerm && !matchesSearchTerm(data, filters.searchTerm)) {
        return;
      }
      
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp
      } as Post);
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
};

/**
 * Fetches posts with pagination
 */
export const getPostsPaginated = async (
  lastVisible?: QueryDocumentSnapshot<DocumentData>,
  filters?: PostFilter
): Promise<{ posts: Post[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let postsQuery = collection(db, 'posts');
    let constraints = [];

    // Add filters if provided
    if (filters) {
      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters.locationName) {
        constraints.push(where('locationName', '==', filters.locationName));
      }
    }

    // Always order by createdAt in descending order
    constraints.push(orderBy('createdAt', 'desc'));
    
    // Add pagination constraints
    constraints.push(limit(POSTS_PER_PAGE));
    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }

    const q = query(postsQuery, ...constraints);
    const querySnapshot = await getDocs(q);

    const posts: Post[] = [];
    let newLastVisible: QueryDocumentSnapshot<DocumentData> | null = null;

    if (!querySnapshot.empty) {
      newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Skip posts that don't match the search term if one is provided
        if (filters?.searchTerm && !matchesSearchTerm(data, filters.searchTerm)) {
          return;
        }
        
        posts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt as Timestamp
        } as Post);
      });
    }

    return { posts, lastVisible: newLastVisible };
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    throw new Error('Failed to fetch paginated posts');
  }
};

/**
 * Updates an existing post
 */
export const updatePost = async (postId: string, postData: Partial<PostInput>): Promise<void> => {
  try {
    const postRef = collection(db, 'posts');
    const docRef = postRef as unknown as DocumentReference;
    
    let updateData: any = { ...postData };
    
    // Handle image upload if a new image is provided
    if (postData.imageFile) {
      const imagePath = `posts_images/${Date.now()}-${postData.imageFile.name}`;
      const imageRef = ref(storage, imagePath);
      await uploadBytes(imageRef, postData.imageFile);
      updateData.imageUrl = await getDownloadURL(imageRef);
      delete updateData.imageFile; // Remove the file from the update data
    }
    
    // If mainCategory is provided, map it to category
    if (updateData.mainCategory) {
      updateData.category = updateData.mainCategory;
      delete updateData.mainCategory;
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }
};

/**
 * Deletes a post and its associated image if it exists
 */
export const deletePost = async (postId: string): Promise<void> => {
  try {
    // First get the post to check if it has an image
    const post = await getPostById(postId);
    
    if (post?.imageUrl) {
      // Extract the path from the URL
      const imageRef = ref(storage, post.imageUrl);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
        // Continue with post deletion even if image deletion fails
      }
    }
    
    const postRef = collection(db, 'posts');
    const docRef = postRef as unknown as DocumentReference;
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
};

/**
 * Gets recent posts for the homepage
 */
export const getRecentPosts = async (count: number = 3): Promise<Post[]> => {
  try {
    const postsQuery = collection(db, 'posts');
    const q = query(postsQuery, orderBy('createdAt', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);

    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp
      } as Post);
    });

    return posts;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw new Error('Failed to fetch recent posts');
  }
};

/**
 * Helper function to check if a post matches a search term
 */
const matchesSearchTerm = (data: DocumentData, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase();
  return (
    (data.title && data.title.toLowerCase().includes(term)) ||
    (data.description && data.description.toLowerCase().includes(term)) ||
    (data.category && data.category.toLowerCase().includes(term)) ||
    (data.subCategory && data.subCategory.toLowerCase().includes(term)) ||
    (data.locationName && data.locationName.toLowerCase().includes(term))
  );
};