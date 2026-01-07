import { create } from 'zustand'

const useUIStore = create((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  searchQuery: '',
  theme: 'dark',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'dark' ? 'light' : 'dark' 
  })),
}))

export default useUIStore
