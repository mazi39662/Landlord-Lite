import { ref, watch, onMounted } from "vue";

const darkMode = ref(false);

function applyDarkMode(enabled: boolean) {
  if (enabled) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

function loadDarkMode() {
  const saved = localStorage.getItem("darkMode");
  darkMode.value = saved === "true";
  applyDarkMode(darkMode.value);
}

watch(darkMode, (newVal) => {
  applyDarkMode(newVal);
  localStorage.setItem("darkMode", newVal.toString());
});

onMounted(() => {
  loadDarkMode();
});

export function useDarkMode() {
  return {
    darkMode,
  };
}
