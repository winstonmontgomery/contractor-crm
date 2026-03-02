// Demo mode - mock Supabase client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockAuthResponse = { data: any; error: null | { message: string } };

export function createClient() {
  const mockUser = { 
    id: 'demo-user-1', 
    email: 'admin@contractorverified.com',
    user_metadata: { full_name: 'Demo Admin', role: 'ADMIN' }
  };
  
  return {
    auth: {
      getUser: async (): Promise<MockAuthResponse> => ({ 
        data: { user: mockUser }, 
        error: null 
      }),
      getSession: async (): Promise<MockAuthResponse> => ({ 
        data: { session: { user: mockUser } }, 
        error: null 
      }),
      signOut: async (): Promise<{ error: null }> => ({ error: null }),
      signInWithPassword: async (_credentials: { email: string; password: string }): Promise<MockAuthResponse> => ({ 
        data: { user: mockUser, session: { user: mockUser } }, 
        error: null 
      }),
      signUp: async (_credentials: { email: string; password: string; options?: { data?: Record<string, unknown> } }): Promise<MockAuthResponse> => ({ 
        data: { user: mockUser, session: null }, 
        error: null 
      }),
      onAuthStateChange: (_callback: (event: string, session: { user: typeof mockUser } | null) => void) => ({ 
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
