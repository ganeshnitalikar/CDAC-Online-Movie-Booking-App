import { createTheme } from "@mui/material/styles";

export const themeColors = {
    light: {
        primary: '#6366F1', // Indigo
        secondary: '#EC4899', // Pink
        accent: '#F59E0B', // Amber
        success: '#10B981', // Emerald
        warning: '#F59E0B', // Amber
        error: '#EF4444', // Red
        background: {
            default: '#F8FAFC', // Slate 50
            paper: '#FFFFFF',
            surface: '#F1F5F9', // Slate 100
        },
        text: {
            primary: '#0F172A', // Slate 900
            secondary: '#475569', // Slate 600
            disabled: '#94A3B8', // Slate 400
        },
        border: '#E2E8F0', // Slate 200
        divider: '#E2E8F0', // Slate 200
    },
    dark: {
        primary: '#818CF8', // Indigo 400
        secondary: '#F472B6', // Pink 400
        accent: '#FBBF24', // Amber 400
        success: '#34D399', // Emerald 400
        warning: '#FBBF24', // Amber 400
        error: '#F87171', // Red 400
        background: {
            default: '#0F172A', // Slate 900
            paper: '#1E293B', // Slate 800
            surface: '#334155', // Slate 700
        },
        text: {
            primary: '#F8FAFC', // Slate 50
            secondary: '#CBD5E1', // Slate 300
            disabled: '#64748B', // Slate 500
        },
        border: '#475569', // Slate 600
        divider: '#334155', // Slate 700
    }
};

export const getAppTheme = (mode = 'dark') => {
    const colors = themeColors[mode];

    return createTheme({
        palette: {
            mode,
            primary: {
                main: colors.primary,
                light: mode === 'light' ? '#A5B4FC' : '#A5B4FC',
                dark: mode === 'light' ? '#4338CA' : '#4338CA',
                contrastText: mode === 'light' ? '#FFFFFF' : '#0F172A',
            },
            secondary: {
                main: colors.secondary,
                light: mode === 'light' ? '#F9A8D4' : '#F9A8D4',
                dark: mode === 'light' ? '#BE185D' : '#BE185D',
                contrastText: mode === 'light' ? '#FFFFFF' : '#0F172A',
            },
            error: {
                main: colors.error,
            },
            warning: {
                main: colors.warning,
            },
            success: {
                main: colors.success,
            },
            background: {
                default: colors.background.default,
                paper: colors.background.paper,
            },
            text: {
                primary: colors.text.primary,
                secondary: colors.text.secondary,
                disabled: colors.text.disabled,
            },
            divider: colors.divider,
        },
        typography: {
            fontFamily: [
                'Poppins',
                'Inter',
                'system-ui',
                'sans-serif',
            ].join(','),
            h1: {
                fontWeight: 700,
                letterSpacing: '-0.025em',
                fontSize: '2.5rem',
            },
            h2: {
                fontWeight: 600,
                letterSpacing: '-0.025em',
                fontSize: '2rem',
            },
            h3: {
                fontWeight: 600,
                letterSpacing: '-0.025em',
                fontSize: '1.5rem',
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.25rem',
            },
            h5: {
                fontWeight: 600,
                fontSize: '1.125rem',
            },
            h6: {
                fontWeight: 600,
                fontSize: '1rem',
            },
            button: {
                textTransform: 'none',
                fontWeight: 600,
                letterSpacing: '0.025em',
            },
            body1: {
                fontSize: '1rem',
                lineHeight: 1.6,
            },
            body2: {
                fontSize: '0.875rem',
                lineHeight: 1.5,
            },
        },
        shape: {
            borderRadius: 12,
        },
        shadows: [
            'none',
            '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            ...Array(19).fill('0 25px 50px -12px rgba(0, 0, 0, 0.25)'),
        ],
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        fontWeight: 600,
                        fontFamily: 'Poppins, sans-serif',
                        textTransform: 'none',
                        padding: '8px 16px',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        },
                    },
                    contained: {
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                        backgroundImage: 'none',
                        backgroundColor: colors.background.paper,
                        border: `1px solid ${colors.border}`,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            transform: 'translateY(-1px)',
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        backgroundColor: colors.background.paper,
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: colors.background.paper,
                        color: colors.text.primary,
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                        borderBottom: `1px solid ${colors.border}`,
                    },
                },
            },
        },
    });
};