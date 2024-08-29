const { createTheme: createMuiTheme } = require("@mui/material/styles");

module.exports = function createTheme(theme, overrides) {
  const themeStyle = {
    "--primary-light": theme.primary.light,
    "--primary-main": theme.primary.main,
    "--primary-dark": theme.primary.dark,
    "--primary-contrast": theme.primary.contrast,
    "--secondary-main": theme.secondary.main,
    "--secondary-contrast": theme.secondary.contrast,
    "--tertiary-light": theme.tertiary.light,
    "--tertiary-main": theme.tertiary.main,
    "--tertiary-dark": theme.tertiary.dark,
    "--tertiary-contrast": theme.tertiary.contrast,
    "--text-primary": theme.text.primary,
    "--text-secondary": theme.text.secondary,
    "--text-disabled": theme.text.disabled,
    "--text-hint": theme.text.hint,
    "--background-main": theme.background.main,
    "--background-highlight": theme.background.highlight,
    "--background-hover": theme.background.hover,
    "--background-disabled": theme.background.disabled,
    "--headline-font": theme.fonts.headline,
    "--body-font": theme.fonts.body,
  };

  // Create a theme instance.
  const muiTheme = createMuiTheme({
    palette: {
      text: {
        primary: theme.text.primary,
        secondary: theme.text.secondary,
        disabled: theme.text.disabled,
        hint: theme.text.hint,
      },
      primary: {
        light: theme.primary.light,
        main: theme.primary.main,
        dark: theme.primary.dark,
        contrastText: theme.primary.contrast,
      },
      secondary: {
        light: theme.secondary.light,
        main: theme.secondary.main,
        dark: theme.secondary.dark,
        contrastText: theme.secondary.contrast,
      },
      tertiary: {
        light: theme.tertiary.light,
        main: theme.tertiary.main,
        dark: theme.tertiary.dark,
        contrastText: theme.tertiary.contrast,
      },
      background: {
        paper: theme.background.main,
        default: theme.background.main,
      },
    },
    typography: {
      fontFamily: theme.fonts.body,
      h1: {
        fontFamily: theme.fonts.headline,
      },
      h2: {
        fontFamily: theme.fonts.headline,
      },
      h3: {
        fontFamily: theme.fonts.headline,
      },
      h4: {
        fontFamily: theme.fonts.headline,
      },
      h5: {
        fontFamily: theme.fonts.headline,
      },
      h6: {
        fontFamily: theme.fonts.headline,
      },
      subtitle1: {
        fontFamily: theme.fonts.headline,
      },
      subtitle2: {
        fontFamily: theme.fonts.headline,
      },
    },
    ...overrides,
  });

  return {
    themeStyle,
    muiTheme,
  };
};
