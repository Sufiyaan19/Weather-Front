// theme.js - Theme management script

// Define themes
const themes = {
    light: {
        '--text-color': '#000000',
        '--bg-color': '#ffffff',
        '--card-bg': 'rgba(255, 255, 255, 0.9)',
        '--border-color': '#cccccc',
        '--button-bg': '#007bff',
        '--button-text': '#ffffff',
        '--navbar-bg': '#f8f9fa',
        '--navbar-text': '#000000',
        '--input-bg': '#ffffff',
        '--input-border': '#cccccc',
        '--dropdown-bg': '#ffffff',
        '--dropdown-text': '#000000'
    },
    dark: {
        '--text-color': '#ffffff',
        '--bg-color': '#000000',
        '--card-bg': 'rgba(0, 0, 0, 0.7)',
        '--border-color': '#ffffff',
        '--button-bg': '#28a745',
        '--button-text': '#ffffff',
        '--navbar-bg': '#000000',
        '--navbar-text': '#ffffff',
        '--input-bg': '#333333',
        '--input-border': '#ffffff',
        '--dropdown-bg': '#000000',
        '--dropdown-text': '#ffffff'
    }
};

// Function to apply theme
function applyTheme(theme) {
    const root = document.documentElement;
    const selectedTheme = themes[theme];
    for (const [property, value] of Object.entries(selectedTheme)) {
        root.style.setProperty(property, value);
    }
    // Background image remains unchanged as per requirements
}

// Load theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
});
