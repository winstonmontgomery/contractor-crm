// Demo mode - mock Supabase server client
export async function createClient() {
  return {
    auth: {
      getUser: async () => ({ 
        data: { 
          user: { 
            id: 'demo-user-1', 
            email: 'admin@contractorverified.com',
            user_metadata: { full_name: 'Demo Admin', role: 'ADMIN' }
          } 
        }, 
        error: null 
      }),
      getSession: async () => ({ 
        data: { 
          session: { 
            user: { 
              id: 'demo-user-1', 
              email: 'admin@contractorverified.com',
              user_metadata: { full_name: 'Demo Admin', role: 'ADMIN' }
            } 
          } 
        }, 
        error: null 
      }),
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null }),
        data: [],
        error: null,
      }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ eq: () => ({ data: null, error: null }) }),
      delete: () => ({ eq: () => ({ data: null, error: null }) }),
    }),
  }
}
