export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};
export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};
export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};
export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};
export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};
export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isEmailVerified: boolean;
  setIsEmailVerified: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};
export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId?: string;
  imageUrl: URL | string;
  file: File[];
};

export type IComment = {
  $id: string;
  post: string;
  userId: string;
  content: string;
  createdAt: string;
  author?: {
    $id: string;
    name: string;
    username: string;
    imageUrl?: string;
  } | null;
};

export type INewComment = {
  postId: string;
  userId: string;
  content: string;
};