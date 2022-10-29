import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
    palette: {
        primary: {
            light: '#799a78',
            main: '#588157',
            dark: '#3d5a3c'

        },
        secondary: {
            light: '#617b66',
            main: '#3a5a40',
            dark: '#283e2c'
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 450,
            md: 660,
            ml: 900,
            lg: 1150,
            xl: 1400,
            xxl: 1700
        },
    }
});