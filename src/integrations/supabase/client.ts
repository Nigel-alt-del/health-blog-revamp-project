
// Temporary mock Supabase client until real integration is set up
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      order: (column: string, options: any) => ({
        async then(callback: any) {
          // Return empty data for now
          return callback({ data: [], error: null });
        }
      })
    }),
    insert: (data: any) => ({
      async then(callback: any) {
        return callback({ data: null, error: null });
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        async then(callback: any) {
          return callback({ data: null, error: null });
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        async then(callback: any) {
          return callback({ data: null, error: null });
        }
      })
    }),
    upsert: (data: any, options?: any) => ({
      async then(callback: any) {
        return callback({ data: null, error: null });
      }
    })
  })
};
