import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import SettingsPage from "./components/auth/SettingsPage";
import SessionsPage from "./components/sessions/SessionsPage";
import Nav from "./components/Nav";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import ExercisesPage from "./components/exercises/ExercisesPage";
import NotFoundPage from "./components/NotFoundPage";

const timezones = ["US/Samoa", "US/Hawaii", "US/Alaska", "US/Pacific", "US/Arizona", "US/Mountain",
    "US/Central", "US/Eastern", "Canada/Atlantic", "Canada/Newfoundland", "America/Buenos_Aires",
    "America/Noronha", "Atlantic/Cape_Verde", "Atlantic/Reykjavik", "Europe/London", "Europe/Amsterdam",
    "Africa/Cairo", "Europe/Istanbul", "Asia/Dubai", "Asia/Karachi", "Asia/Omsk", "Asia/Jakarta", "Asia/Hong_Kong",
    "Asia/Tokyo", "Australia/Brisbane", "Australia/Melbourne", "Pacific/Fiji"];

const muscleGroups = ["chest", "shoulders", "biceps", "triceps",
    "forearms", "traps", "neck", "lats", "lower_back", "abs",
    "hamstrings", "quads", "glutes", "calves", "tibialis", "cardio"];

const muscleGroupsForAnalytics = muscleGroups.slice();
muscleGroupsForAnalytics.unshift("all");

const basename = document.querySelector('base')?.getAttribute('href') ?? '/';

function App() {
    const [message, setMessage] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
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

    // User information
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [firstVisit, setFirstVisit] = useState(false);
    const [timezone, setTimezone] = useState(null);

    const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";

    const fetchUserUrl = `/api/auth/getUser`;
    const fetchUser = useCallback(async () => {
        const response = await fetch(`/api/auth/getUser`, { credentials: "include" });
        if (!response.ok) {
            throw new Error(`status ${response.status}`);
        }
        try {
            const json = await response.json();
            setMessage(json.message);
            setUser(json.user);
            setUserId(json.id);
            setFirstVisit(json.firstVisit);
            setTimezone(json.timezone);
            setIsFetching(false);
        } catch (e) {
            setMessage(`API call failed: ${e}`);
            setIsFetching(false);
        }
    }, [fetchUserUrl]);

    useEffect(() => {
        setIsFetching(true);
        fetchUser();
    }, [fetchUser, firstVisit]);

    const debugText = (
        <div>
            <p>
                {"« "}
                <strong>{isFetching ? "Fetching user " : message}</strong>
                {" »"}
            </p>
            {process.env.NODE_ENV === "production" ? (
                <p>This is a production build.</p>
            ) : (
                <p>You're not on PROD.</p>
            )}
        </div>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Router basename={basename}>
                <div className="App">
                    <header className="App-header">
                        <Nav user={user} darkMode={darkMode} toggleDarkMode={() => { setDarkMode(!darkMode) }} />
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={user ? <SessionsPage
                                    user={user}
                                    userId={userId}
                                    timezone={timezone}
                                    firstVisit={firstVisit}
                                    setFirstVisit={setFirstVisit}
                                    muscleGroups={muscleGroups}
                                    darkMode={darkMode}
                                /> : <LoginPage />}
                            />
                            <Route
                                exact
                                path="/sessions"
                                element={user ?
                                    <SessionsPage
                                        user={user}
                                        userId={userId}
                                        timezone={timezone}
                                        firstVisit={firstVisit}
                                        setFirstVisit={setFirstVisit}
                                        muscleGroups={muscleGroups}
                                        darkMode={darkMode}
                                    />
                                    : <LoginPage />}
                            />
                            <Route
                                exact
                                path="/exercises"
                                element={user ?
                                    <ExercisesPage
                                        user={user}
                                        userId={userId}
                                        muscleGroups={muscleGroups}
                                        setFirstVisit={setFirstVisit}
                                    />
                                    : <LoginPage />}
                            />
                            <Route
                                exact
                                path="/analytics"
                                element={user ?
                                    <AnalyticsPage
                                        user={user}
                                        muscleGroups={muscleGroupsForAnalytics}
                                    />
                                    : <LoginPage />}
                            />
                            <Route
                                exact
                                path="/settings"
                                element={user ?
                                    <SettingsPage
                                        user={user}
                                        userId={userId}
                                        timezones={timezones}
                                        timezone={timezone}
                                        setTimezone={setTimezone}
                                    />
                                    : <LoginPage />}
                            />

                            <Route exact path="/register" element={<RegisterPage timezones={timezones} />} />
                            <Route exact path="/login" element={<LoginPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                        {/* {debugText} */}
                    </header>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
