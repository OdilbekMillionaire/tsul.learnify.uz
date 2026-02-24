/**
 * tRPC Client - Stub Implementation
 * Provides type-safe API communication layer
 * Full implementation requires tRPC backend setup
 */

// Stub mutation and query implementations
const createStubMutation = () => ({
  mutateAsync: async (data: unknown) => Promise.resolve({}),
  isPending: false,
  isLoading: false,
  error: null,
});

const createStubQuery = () => ({
  data: null,
  isLoading: false,
  error: null,
  refetch: async () => Promise.resolve(),
});

export const trpc = {
  generation: {
    createSession: {
      useMutation: () => createStubMutation(),
    },
    updateProgress: {
      useMutation: () => createStubMutation(),
    },
  },
  lessons: {
    list: {
      useQuery: () => ({ ...createStubQuery(), data: [] }),
    },
    get: {
      useQuery: () => createStubQuery(),
    },
    getSources: {
      useQuery: () => ({ ...createStubQuery(), data: [] }),
    },
    delete: {
      useMutation: () => createStubMutation(),
    },
    exportPDF: {
      useMutation: () => createStubMutation(),
    },
  },
  chat: {
    getHistory: {
      useQuery: () => ({ ...createStubQuery(), data: [] }),
    },
    addMessage: {
      useMutation: () => createStubMutation(),
    },
    exportChatPDF: {
      useMutation: () => createStubMutation(),
    },
  },
  ratings: {
    rate: {
      useMutation: () => createStubMutation(),
    },
  },
};
