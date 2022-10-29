import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./themes/theme";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import SessionsPage from "./components/sessions/SessionsPage";
import Nav from "./components/Nav";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import ExercisesPage from "./components/exercises/ExercisesPage";

const muscleGroups = ["chest", "shoulders", "biceps", "triceps",
    "forearms", "traps", "neck", "lats", "lower_back", "abs",
    "hamstrings", "quads", "glutes", "calves", "tibialis", "cardio"];

const muscleGroupsForAnalytics = muscleGroups.slice();
muscleGroupsForAnalytics.unshift("all");

function App() {
    const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";

    const [message, setMessage] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [firstVisit, setFirstVisit] = useState(false);
    const [timezone, setTimezone] = useState(null);
    const fetchUserUrl = `${baseUrl}/api/auth/getUser`;

    const fetchUser = useCallback(async () => {
        const response = await fetch(fetchUserUrl, { credentials: "include" });
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
        <ThemeProvider theme={appTheme}>
            <CssBaseline enableColorScheme />
            <Router>
                <div className="App">
                    <header className="App-header">
                        <Nav user={user} />
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={<SessionsPage
                                    user={user}
                                    userId={userId}
                                    timezone={timezone}
                                    firstVisit={firstVisit}
                                    setFirstVisit={setFirstVisit}
                                    muscleGroups={muscleGroups}
                                />}
                            />
                            <Route
                                exact
                                path="/sessions"
                                element={
                                    <SessionsPage
                                        user={user}
                                        userId={userId}
                                        timezone={timezone}
                                        firstVisit={firstVisit}
                                        setFirstVisit={setFirstVisit}
                                        muscleGroups={muscleGroups}
                                    />
                                }
                            />
                            <Route
                                exact
                                path="/exercises"
                                element={
                                    <ExercisesPage
                                        user={user}
                                        userId={userId}
                                        muscleGroups={muscleGroups}
                                        setFirstVisit={setFirstVisit}
                                    />
                                }
                            />
                            <Route
                                exact
                                path="/analytics"
                                element={
                                    <AnalyticsPage
                                        user={user}
                                        muscleGroups={muscleGroupsForAnalytics}
                                    />
                                }
                            />
                            <Route exact path="/register" element={<RegisterPage />} />
                            <Route exact path="/login" element={<LoginPage />} />
                        </Routes>
                        {/* {debugText} */}
                    </header>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
