import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  User, 
  Project, 
  Prompt, 
  TestRun, 
  ABTest, 
  Dataset, 
  Workspace,
  Analytics,
  Notification 
} from '@/types'

interface AppState {
  // User and workspace
  currentUser: User | null
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  
  // Data
  projects: Project[]
  prompts: Prompt[]
  testRuns: TestRun[]
  abTests: ABTest[]
  datasets: Dataset[]
  analytics: Analytics | null
  
  // UI state
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  
  // Actions
  setCurrentUser: (user: User | null) => void
  setCurrentWorkspace: (workspace: Workspace | null) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  setProjects: (projects: Project[]) => void
  setPrompts: (prompts: Prompt[]) => void
  addPrompt: (prompt: Prompt) => void
  updatePrompt: (id: string, updates: Partial<Prompt>) => void
  deletePrompt: (id: string) => void
  setTestRuns: (testRuns: TestRun[]) => void
  addTestRun: (testRun: TestRun) => void
  setABTests: (abTests: ABTest[]) => void
  addABTest: (abTest: ABTest) => void
  setDatasets: (datasets: Dataset[]) => void
  setAnalytics: (analytics: Analytics) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  removeNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentUser: null,
      currentWorkspace: null,
      workspaces: [],
      projects: [],
      prompts: [],
      testRuns: [],
      abTests: [],
      datasets: [],
      analytics: null,
      sidebarCollapsed: false,
      theme: 'dark',
      notifications: [],
      
      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      setProjects: (projects) => set({ projects }),
      setPrompts: (prompts) => set({ prompts }),
      addPrompt: (prompt) => set((state) => ({ 
        prompts: [...state.prompts, prompt] 
      })),
      updatePrompt: (id, updates) => set((state) => ({
        prompts: state.prompts.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      deletePrompt: (id) => set((state) => ({
        prompts: state.prompts.filter(p => p.id !== id)
      })),
      setTestRuns: (testRuns) => set({ testRuns }),
      addTestRun: (testRun) => set((state) => ({ 
        testRuns: [...state.testRuns, testRun] 
      })),
      setABTests: (abTests) => set({ abTests }),
      addABTest: (abTest) => set((state) => ({ 
        abTests: [...state.abTests, abTest] 
      })),
      setDatasets: (datasets) => set({ datasets }),
      setAnalytics: (analytics) => set({ analytics }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        }]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
    }),
    {
      name: 'promptrix-store',
    }
  )
) 