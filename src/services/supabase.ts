import { auth } from './firebase';
import { signInWithEmailLink, sendSignInLinkToEmail, onAuthStateChanged, User, Auth } from 'firebase/auth';

// Mock supabase object to maintain compatibility
export const supabase = {
  auth: {
    async getSession(): Promise<{ data: { session: any }, error: any }> {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve({
            data: {
              session: user ? {
                user: {
                  id: user.uid,
                  email: user.email,
                },
                access_token: null, // Firebase doesn't expose access tokens directly
              } : null,
            },
            error: null,
          });
        });
      });
    },

    async signInWithOtp({ email }: { email: string }): Promise<{ error: any }> {
      try {
        await sendSignInLinkToEmail(auth, email, {
          url: `${window.location.origin}/`,
          handleCodeInApp: true,
        });
        window.localStorage.setItem('emailForSignIn', email);
        return { error: null };
      } catch (error: any) {
        console.error('sendSignInLinkToEmail error:', error);
        return { error: { message: error.message } };
      }
    },

    onAuthStateChange(callback: (event: string, session: any) => void): { data: { subscription: { unsubscribe: () => void } } } {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          callback('SIGNED_IN', {
            user: {
              id: user.uid,
              email: user.email,
            },
          });
        } else {
          callback('SIGNED_OUT', null);
        }
      });

      return {
        data: {
          subscription: {
            unsubscribe,
          },
        },
      };
    },
  },
};