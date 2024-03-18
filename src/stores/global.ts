import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({ themeColor: '#1677ff' }),
  getters: {
  },
  actions: {
    setThemeColor(value: string) {
      this.themeColor = value;
    },
  },
})