export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface State {
  id: string;
  name: any;
}

export interface City {
  id: string;
  name: any;
  stateId: string;
}

export interface EPaper {
  name: any;
  imageurl: string | Blob | undefined;
  id: string;
  title: string;
  description: string | null;
  publicationDate: string;
  stateId: string;
  cityId: string;
  filePath: string;
  thumbnailUrl: string | null;
  state?: State;
  city?: City;
}

export interface DownloadLog {
  id: string;
  userId: string;
  epaperId: string;
  downloadedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
}
