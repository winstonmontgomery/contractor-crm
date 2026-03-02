// Demo mode - mock Supabase client
/* eslint-disable @typescript-eslint/no-explicit-any */
type MockUser = { 
  id: string; 
  email: string;
  user_metadata: { full_name: string; role: string };
};

type MockSession = { 
  user: MockUser;
} | null;

type AuthCallback = (event: string, session: MockSession) => void | Promise<void>;

export function createClient() {
  const mockUser: MockUser = { 
    id: 'demo-user-1', 
    email: 'admin@contractorverified.com',
    user_metadata: { full_name: 'Demo Admin', role: 'ADMIN' }
  };
  
  return {
    auth: {
      getUser: async () => ({ 
        data: { user: mockUser }, 
        error: null 
      }),
      getSession: async () => ({ 
        data: { session: { user: mockUser } as MockSession }, 
        error: null 
      }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async (_credentials: { email: string; password: string }) => ({ 
        data: { user: mockUser, session: { user: mockUser } }, 
        error: null 
      }),
      signUp: async (_credentials: { email: string; password: string; options?: { data?: Record<string, unknown> } }) => ({ 
        data: { user: mockUser, session: null }, 
        error: null 
      }),
      onAuthStateChange: (_callback: AuthCallback) => ({ 
        data: { subscription: { unsubscribe: () => {} } } 
      }),
    },
    from: (_table: string) => {
      const chainable = {
        select: (_columns?: string) => chainable,
        eq: (_col: string, _val: unknown) => chainable,
        neq: (_col: string, _val: unknown) => chainable,
        in: (_col: string, _vals: unknown[]) => chainable,
        is: (_col: string, _val: unknown) => chainable,
        order: (_col: string, _opts?: { ascending?: boolean }) => chainable,
        limit: (_n: number) => chainable,
        single: () => ({ data: null, error: null }),
        maybeSingle: () => ({ data: null, error: null }),
        then: (resolve: (val: { data: never[]; error: null }) => void) => resolve({ data: [], error: null }),
        data: [] as never[],
        error: null,
      };
      return {
        ...chainable,
        insert: (_data: unknown) => ({ data: null, error: null, select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: (_data: unknown) => ({ eq: (_col: string, _val: unknown) => ({ data: null, error: null }), match: (_obj: unknown) => ({ data: null, error: null }) }),
        delete: () => ({ eq: () => ({ data: null, error: null }) }),
        upsert: (_data: unknown) => ({ data: null, error: null }),
      };
    },
  };
}
