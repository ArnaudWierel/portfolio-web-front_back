export const useTheme = () => {
    const isDark = ref(true)

    // Charger le thème depuis localStorage au montage
    const loadTheme = () => {
        if (process.client) {
            const savedTheme = localStorage.getItem('theme')
            if (savedTheme) {
                isDark.value = savedTheme === 'dark'
            } else {
                // Détecter la préférence système
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                isDark.value = prefersDark
            }
            applyTheme()
        }
    }

    // Appliquer le thème au DOM
    const applyTheme = () => {
        if (process.client) {
            document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
        }
    }

    // Basculer le thème et sauvegarder
    const toggleTheme = () => {
        isDark.value = !isDark.value
        applyTheme()
        if (process.client) {
            localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        }
    }

    // Initialiser le thème immédiatement si on est côté client
    if (process.client) {
        loadTheme()
    } else {
        // Sinon, charger au montage
        onMounted(() => {
            loadTheme()
        })
    }

    return {
        isDark,
        toggleTheme,
        applyTheme,
        loadTheme
    }
}

