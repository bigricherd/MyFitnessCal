import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterPage from "./components/pages/RegisterPage";
import LoginPage from "./components/pages/LoginPage";
import SetsPage from "./components/pages/SetsPage";
import HomePage from "./components/pages/HomePage";
import SessionsPage from "./components/pages/SessionsPage";
import Nav from "./components/Nav";
import AnalyticsPage from "./components/pages/AnalyticsPage";
import ExercisesPage from "./components/pages/ExercisesPage";
import formatEnum from "./helpers/formatEnum";

function App() {
    const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";

    const [message, setMessage] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
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
            setIsFetching(false);
        } catch (e) {
            setMessage(`API call failed: ${e}`);
            setIsFetching(false);
        }
    }, [fetchUserUrl]);

    let muscleGroupsArr = [];
    let muscleGroupsForAnalyticsArr = [];
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [muscleGroupsForAnalytics, setMuscleGroupsForAnalytics] = useState([]);
    const fetchMuscleGroupsUrl = `${baseUrl}/api/enums`;

    const fetchMuscleGroups = useCallback(async () => {
        const data = await fetch(fetchMuscleGroupsUrl);
        const json = await data.json();
        muscleGroupsArr = formatEnum(json.muscleGroups);
        muscleGroupsForAnalyticsArr = formatEnum(json.muscleGroups);
        muscleGroupsForAnalyticsArr.unshift("All");

        setMuscleGroups(muscleGroupsArr);
        setMuscleGroupsForAnalytics(muscleGroupsForAnalyticsArr);
    }, [fetchMuscleGroupsUrl]);

    useEffect(() => {
        setIsFetching(true);
        fetchUser();
        fetchMuscleGroups();
    }, [fetchUser, fetchMuscleGroups]);

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
        <Router>
            <div className="App">
                <header className="App-header">
                    <Nav user={user} />
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={<HomePage user={user} />}
                        />
                        <Route
                            exact
                            path="/sessions"
                            element={
                                <SessionsPage
                                    user={user}
                                    userId={userId}
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
                        <Route
                            exact
                            path="/sets"
                            element={
                                <SetsPage
                                    user={user}
                                    userId={userId}
                                    muscleGroups={muscleGroups}
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
    );
}

export default App;
