import { AppBar, Drawer, Box, Toolbar, Button, IconButton, List, ListItem, Container, Typography, Divider, Stack, Tooltip } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // This is what we are using right now, as MUILink refreshes the page and logs the user out. Seems like a session problem.

//const drawerWidth = 240;
const navItems = ['Sessions', 'Exercises', 'Analytics'];
const authPages = ['Register', 'Login'];

const Nav = (props) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pages, setPages] = useState(authPages);

    const [showAuthTooltip, setShowAuthTooltip] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/logout", { credentials: "include" });
        if (res.ok) {
            window.location = '/';
        }
    }

    // Set the list of pages depending on whether a user is logged in
    useEffect(() => {
        setPages(props.user ? navItems : authPages);
    }, [props]);

    const authSettings = <Stack direction="column" alignItems="center" justifyContent="center">
        <Button
            onClick={props.toggleDarkMode}
            sx={{ color: "white" }}
        >
            {props.darkMode ? "Light mode" : "Dark mode"}
        </Button>
        <Button>
            <Link to="/settings" style={{
                color: "white",
                textDecoration: "none"
            }}>Account</Link>
        </Button>
        <Button sx={{ color: '#f44336' }} onClick={handleLogout}>
            Logout
        </Button>
    </Stack >


    // Sidebar that opens when the hamburger icon is clicked
    const drawer = <Box onClick={handleDrawerToggle}>
        <Typography
            variant='h6'
            sx={{ my: 2, mx: 3, color: props.darkMode ? "white" : "#373737" }}>
            MyFitnessCal
        </Typography>
        <Divider />

        {/* List of pages */}
        <List>
            {pages.map((item) => (
                <ListItem key={item}>
                    <Button>
                        <Link
                            to={`/${item.toLowerCase()}`}
                            style={{
                                textDecoration: "none",
                                color: props.darkMode ? "white" : "#515151"
                            }}
                        >
                            {item}
                        </Link>
                    </Button>
                </ListItem>
            ))}

            {/* Settings and logout buttons if a user is logged in */}
            {props.user ?
                <>
                    <ListItem>
                        <Button>
                            <Link to="/settings" style={{
                                color: props.darkMode ? "white" : "#515151",
                                textDecoration: "none"
                            }}>Settings</Link>
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            onClick={handleLogout}
                            sx={{ color: props.darkMode ? "white" : "#515151" }}
                        >
                            Logout |
                            <Typography
                                sx={{ marginLeft: "4px", fontSize: "inherit" }}
                                color="primary"
                            >
                                {props.user}
                            </Typography>
                        </Button>
                    </ListItem>
                </>
                : null}

            {/* Toggle theme button */}
            <ListItem>
                <Button
                    variant="outlined"
                    onClick={props.toggleDarkMode}
                    sx={{ color: props.darkMode ? "white" : "#515151" }}
                >
                    {props.darkMode ? "Light mode" : "Dark mode"}
                </Button>
            </ListItem>
        </List>
    </Box >;

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar>
                <Container>
                    <Toolbar>

                        {/* Hamburger icon shown when collapsed + options shown on click */}
                        <IconButton color='inherit' onClick={handleDrawerToggle} sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}>
                            <Menu />
                        </IconButton>

                        {/* Title */}
                        <Typography variant='h6' component='div' sx={{ flexGrow: 1, display: { xs: 'block' } }}>
                            MyFitnessCal
                        </Typography>

                        {/* Row of pages shown when expanded. */}
                        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {
                                props.user && pages.map((page) => (
                                    <Button key={page} sx={{ my: 2, display: 'block' }}>
                                        <Link
                                            to={`/${page.toLowerCase()}`}
                                            style={{
                                                color: "white",
                                                textDecoration: "none"
                                            }}>
                                            {page}
                                        </Link>
                                    </Button>
                                ))
                            }
                            {props.user ?
                                <>
                                    <Tooltip title={authSettings} >
                                        <Button
                                            sx={{ color: 'white' }}
                                        >
                                            Settings | <Typography
                                                sx={{
                                                    marginLeft: "4px",
                                                    fontSize: "inherit",
                                                    color: props.darkMode ? "#42a5f5" : "#81d4fa"
                                                }}
                                            >
                                                {props.user}
                                            </Typography>
                                        </Button>
                                    </Tooltip>
                                </>
                                : null}
                        </Stack>

                    </Toolbar>
                </Container>
            </AppBar>

            {/* Sidebar shown by clicking <Menu/> in <IconButton> above, hid by clicking anywhere else */}
            <Box component='nav'>
                <Drawer
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block' }, boxSizing: 'border-box' }}>
                    {drawer}
                </Drawer>
            </Box>
        </Box >
    )

}

export default Nav;