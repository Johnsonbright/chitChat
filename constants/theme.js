export const theme = {
  colors: {
    primary: "#007AFF", // A vibrant blue for primary actions (iOS-style)
    primaryDark: "#0056B3", // Darker blue for hover/active states
    dark: "#121212", // Deep black for dark mode (optional)
    darkLight: "#F0F2F5", // Light grayish-blue for soft backgrounds (modern UI feel)
    gray: "#B0B3B8", // Neutral gray for borders and subtle text

    text: "#000000", // Dark text for readability on white background
    textLight: "#666666", // Muted text for descriptions or secondary content
    textDark: "#000000", // Pure black for maximum emphasis (titles, headers)

    rose: "#FF3B30", // Bright red for notifications, alerts, and errors
    roseLight: "#FF6B6B", // Softer red for warnings or subtle highlights
  },

  fonts: {
    medium: "500", // Modern, clean typography for body text
    semibold: "600", // Stronger emphasis for headings
    bold: "700", // Profile names, buttons, and important elements
    extraBold: "800", // Branding, logos, and impactful highlights
  },

  radius: {
    xs: 8, // Small buttons & chips
    sm: 10, // Default button radius
    md: 12, // Cards & input fields
    lg: 16, // Profile pictures, modals
    xl: 20, // Larger UI elements
    xxl: 24, // Highly rounded containers for smooth UI
  },
};
