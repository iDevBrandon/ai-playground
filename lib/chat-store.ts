import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatItem {
  id: string
  title: string
  createdAt: Date
}

interface ChatStore {
  chatHistory: ChatItem[]
  currentChatId: string
  setChatHistory: (history: ChatItem[] | ((prev: ChatItem[]) => ChatItem[])) => void
  setCurrentChatId: (chatId: string) => void
  addChat: (chat: ChatItem) => void
  updateChat: (chatId: string, updates: Partial<ChatItem>) => void
  deleteChat: (chatId: string) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatHistory: [
        {
          id: "default-1",
          title: "Packify AI Interface",
          createdAt: new Date()
        },
        {
          id: "default-2",
          title: "Packaging Design Consultation",
          createdAt: new Date()
        },
      ],
      currentChatId: "default-1",
      setChatHistory: (history) => {
        if (typeof history === 'function') {
          set((state) => ({ chatHistory: history(state.chatHistory) }))
        } else {
          set({ chatHistory: history })
        }
      },
      setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
      addChat: (chat) => set((state) => ({ 
        chatHistory: [...state.chatHistory, chat] 
      })),
      updateChat: (chatId, updates) => set((state) => ({
        chatHistory: state.chatHistory.map(chat => 
          chat.id === chatId ? { ...chat, ...updates } : chat
        )
      })),
      deleteChat: (chatId) => set((state) => ({
        chatHistory: state.chatHistory.filter(chat => chat.id !== chatId)
      }))
    }),
    {
      name: 'chat-store', // localStorage key
      partialize: (state) => ({ 
        chatHistory: state.chatHistory,
        currentChatId: state.currentChatId 
      }),
    }
  )
)