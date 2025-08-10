import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
  // State
  const isSidebarOpen = ref(false);
  const isDarkMode = ref(false);
  const currentTheme = ref("light");

  // Actions
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    currentTheme.value = isDarkMode.value ? "dark" : "light";

    // Apply theme to document
    if (process.client) {
      document.documentElement.classList.toggle("dark", isDarkMode.value);
    }
  };

  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value;
    currentTheme.value = isDarkMode.value ? "dark" : "light";

    // Apply theme to document
    if (process.client) {
      document.documentElement.classList.toggle("dark", isDarkMode.value);
    }
  };

  const initTheme = () => {
    if (process.client) {
      // Check for saved preference or system preference
      const savedTheme = localStorage.getItem("color-theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    }
  };

  return {
    // State
    isSidebarOpen,
    isDarkMode,
    currentTheme,

    // Actions
    toggleSidebar,
    toggleDarkMode,
    setDarkMode,
    initTheme,
  };
});
