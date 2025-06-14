
// Temporary mock Supabase client until real integration is set up
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      order: (column: string, options: any) => Promise.resolve({ data: [], error: null }),
      then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
    }),
    upsert: (data: any, options?: any) => Promise.resolve({ data: null, error: null })
  })
};
