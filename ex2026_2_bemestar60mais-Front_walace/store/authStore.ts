import { create } from 'zustand'

type Role = 'usuario' | 'instrutor' | string

type AuthState = {
  id: string | null
  nome: string | null
  email: string | null
  token: string | null
  refresh: string | null
  role: Role | null
  isFirstLogin: boolean
  password: string | null
}

type AuthActions = {
  setAuthData: (data: Partial<AuthState>) => void
  clearAuth: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set) => ({
  id: null,
  nome: null,
  email: null,
  token: null,
  refresh: null,
  role: null,
  isFirstLogin: false,
  password: null,

  setAuthData: (data) => set((state) => ({ ...state, ...data })),

  clearAuth: () =>
    set({
      id: null,
      nome: null,
      email: null,
      token: null,
      refresh: null,
      role: null,
      isFirstLogin: false,
    }),
}))