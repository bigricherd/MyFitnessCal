import { blue, pink } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
    palette: {
        primary: pink,
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