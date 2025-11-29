import { INewComment, INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { ID, Query, Models } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: new URL(avatarUrl),
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    try {
      await account.createVerification(`${window.location.origin}/verify`);
    } catch (error) {
      console.log("Verification email skipped/failed:", error);
    }

    return session;

  } catch (error) {
    console.log("SIGN IN ERROR:", error);
  }
}

export async function confirmVerification(userId: string, secret: string) {
  try {
    const result = await account.updateVerification(userId, secret);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createPasswordRecovery(email: string) {
  try {
    const result = await account.createRecovery(
      email,
      `${window.location.origin}/reset-password`
    );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updatePasswordRecovery(
  userId: string,
  secret: string,
  password: string
) {
  try {
    const result = await account.updateRecovery(userId, secret, password);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;
    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl as any, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}
export function getFilePreview(fileId: string): string | undefined {
  try {
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId,
    );

    if (!fileUrl) throw Error;

    // Convert URL to string and ensure it uses '/view' instead of '/preview'
    const urlString: string = typeof fileUrl === 'string' ? fileUrl : String(fileUrl);
    return urlString.replace('/preview', '/view');
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    const allposts = posts.documents.map((p) => ({
      ...p,
      imageUrl: p.imageUrl.replace('/preview', '/view'),
    }));
    if (!posts) throw Error;

    return allposts;
  } catch (error) {
    console.log(error);
  }
}

export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );


    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    const formattedPost = {
      ...post,
      imageUrl: post.imageUrl?.replace("/preview", "/view"),
      imageId: post.imageId, // Explicitly preserve imageId
    };

    return formattedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(3)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );
    console.log(posts)

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function createComment(comment: INewComment) {
  if (!appwriteConfig.commentsCollectionId) {
    throw new Error("Comments collection is not configured.");
  }
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        post: comment.postId,
        userId: comment.userId,
        content: comment.content,
      }
    );
    if (!newComment) throw Error;

    return newComment;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getCommentsByPost(postId: string) {
  if (!appwriteConfig.commentsCollectionId) {
    throw new Error("Comments collection is not configured.");
  }
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [Query.equal("post", postId), Query.orderDesc("$createdAt")]
    );

    if (!comments) throw Error;

    const userIds = Array.from(
      new Set(
        comments.documents
          .map((comment: Models.Document) => comment.userId)
          .filter(Boolean)
      )
    );

    const userMap = new Map<
      string,
      { $id: string; name: string; username: string; imageUrl?: string }
    >();

    await Promise.all(
      userIds.map(async (userId) => {
        try {
          const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
          );
          userMap.set(userId, {
            $id: user.$id,
            name: user.name,
            username: user.username,
            imageUrl: user.imageUrl,
          });
        } catch (error) {
          console.log("Failed to fetch user for comment", userId, error);
        }
      })
    );

    const enrichedDocuments = comments.documents.map((comment: Models.Document) => ({
      ...comment,
      author: userMap.get(comment.userId) ?? null,
    }));

    return { ...comments, documents: enrichedDocuments };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteComment(commentId: string) {
  if (!appwriteConfig.commentsCollectionId) {
    throw new Error("Comments collection is not configured.");
  }

  try {
    const status = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );

    if (!status) throw Error;

    return status;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let imageUrl = user.imageUrl;
    let newImageId: string | undefined;

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      // fileUrl is already a string from getFilePreview
      imageUrl = fileUrl;
      newImageId = uploadedFile.$id;
    }

    //  Update user (only update fields that exist in schema: name, bio, imageUrl)
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: typeof imageUrl === 'string' ? imageUrl : imageUrl.toString(),
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate && newImageId) {
        await deleteFile(newImageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    // Only delete if we have an old imageId and uploaded a new file
    if (user.imageId && hasFileToUpdate && newImageId) {
      try {
        await deleteFile(user.imageId);
      } catch (error) {
        // Ignore errors when deleting old file (it might not exist)
        console.log("Could not delete old file:", error);
      }
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ============================== CHECK IF USER IS FOLLOWING
export async function checkUserFollowStatus(userId: string, followUserId: string) {
  try {
    if (!userId || !followUserId) return null;

    const followDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [
        Query.equal("followerId", userId),
        Query.equal("followingId", followUserId),
      ]
    );

    return followDocuments.documents.length > 0 ? followDocuments.documents[0] : null;
  } catch (error) {
    console.log("Error checking follow status:", error);
    return null;
  }
}

//follow user
export async function followUser(userId: string, followUserId: string) {
  try {
    if (!userId || !followUserId) {
      throw new Error("User ID and Follow User ID are required");
    }

    // Check if already following
    const existingFollow = await checkUserFollowStatus(userId, followUserId);
    if (existingFollow) {
      return existingFollow; // Already following
    }

    const followDocument = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      ID.unique(),
      {
        followerId: userId,
        followingId: followUserId,
        followedAt: new Date().toISOString(),
      }
    );
    if (!followDocument) throw Error;
    return followDocument;
  } catch (error) {
    console.log("Error following user:", error);
    throw error;
  }
}
export async function unfollowUser(userId: string, followUserId: string) {
  try {
    if (!userId || !followUserId) {
      throw new Error("User ID and Follow User ID are required");
    }

    // Find the follow document
    const followDocument = await checkUserFollowStatus(userId, followUserId);

    if (!followDocument) {
      return { status: "ok" }; // Already not following
    }

    // Delete the follow document
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      followDocument.$id
    );

    return { status: "ok" };
  } catch (error) {
    console.log("Error unfollowing user:", error);
    throw error;
  }
}

// ============================== GET FOLLOWERS COUNT
export async function getFollowersCount(userId: string) {
  try {
    if (!userId) return 0;

    const followDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("followingId", userId)]
    );

    return followDocuments.total || 0;
  } catch (error) {
    console.log("Error getting followers count:", error);
    return 0;
  }
}

// ============================== GET FOLLOWING COUNT
export async function getFollowingCount(userId: string) {
  try {
    if (!userId) return 0;

    const followDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("followerId", userId)]
    );

    return followDocuments.total || 0;
  } catch (error) {
    console.log("Error getting following count:", error);
    return 0;
  }
}
// ============================== GET FOLLOWERS LIST
export async function getFollowersList(userId: string) {
  try {
    if (!userId) return [];

    // Get all follow documents where this user is being followed
    const followDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("followingId", userId)]
    );

    // Extract follower IDs
    const followerIds = followDocuments.documents.map((doc) => doc.followerId);

    if (followerIds.length === 0) return [];

    // Fetch user details for all followers
    const followers = await Promise.all(
      followerIds.map(async (followerId) => {
        try {
          const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            followerId
          );
          return {
            $id: user.$id,
            name: user.name,
            username: user.username,
            imageUrl: user.imageUrl,
          };
        } catch (error) {
          console.log("Error fetching follower:", followerId, error);
          return null;
        }
      })
    );

    // Filter out any null values from failed fetches
    return followers.filter((follower) => follower !== null);
  } catch (error) {
    console.log("Error getting followers list:", error);
    return [];
  }
}

// ============================== GET FOLLOWING LIST
export async function getFollowingList(userId: string) {
  try {
    if (!userId) return [];

    // Get all follow documents where this user is the follower
    const followDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("followerId", userId)]
    );

    // Extract following IDs
    const followingIds = followDocuments.documents.map((doc) => doc.followingId);

    if (followingIds.length === 0) return [];

    // Fetch user details for all following users
    const following = await Promise.all(
      followingIds.map(async (followingId) => {
        try {
          const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            followingId
          );
          return {
            $id: user.$id,
            name: user.name,
            username: user.username,
            imageUrl: user.imageUrl,
          };
        } catch (error) {
          console.log("Error fetching following user:", followingId, error);
          return null;
        }
      })
    );

    // Filter out any null values from failed fetches
    return following.filter((user) => user !== null);
  } catch (error) {
    console.log("Error getting following list:", error);
    return [];
  }
}

// ============================== DELETE POST
export async function deletePost(postId: string, imageId: string) {
  if (!postId) throw Error;

  try {
    // Delete the post document
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    // Delete the associated image file
    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
