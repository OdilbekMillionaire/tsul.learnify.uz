/**
 * useAuth Hook - Stub Implementation
 * Provides authentication context and user data
 */

export interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  // Stub implementation
  const user: User | null = null;
  const isLoading = false;
  const error = null;
  const login = async (email: string, password: string) => {
    // Stub
  };
  const logout = () => {
    // Stub
  };
  const register = async (email: string, password: string, name: string) => {
    // Stub
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    register,
  };
};
