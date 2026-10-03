/**
 * Authentication Helper Configuration for Google OAuth & Supabase Auth
 */

export interface GoogleUserSession {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const AUTH_CONFIG = {
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'FACE_OFF_GOOGLE_CLIENT_ID',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-project.supabase.co',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
};

/**
 * Initiates Google OAuth Sign-In flow
 */
export function signInWithGoogle(): void {
  // In production, redirects to Supabase / NextAuth Google Provider OAuth endpoint
  const redirectUri = `${window.location.origin}/api/auth/callback/google`;
  console.log('Redirecting to Google OAuth Sign-In:', redirectUri);

  // Fallback demo Google user session for local preview
  const demoGoogleUser: GoogleUserSession = {
    id: `google_user_${Date.now()}`,
    name: 'Google User',
    email: 'user@gmail.com',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  };

  localStorage.setItem('faceoff_google_session', JSON.stringify(demoGoogleUser));
}
