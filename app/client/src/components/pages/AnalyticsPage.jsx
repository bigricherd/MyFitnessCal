import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VolumeCounter from '../forms/VolumeCounter';
import ProgressTracker from '../forms/ProgressTracker';
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

function AnalyticsPage(props) {
    const [user, setUser] = useState(props.user);
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);

    // Views
    const [view, setView] = useState("0");
    const handleChange = (event, newValue) => {
        setView(newValue);
    }

    // Update state every time props.user is updated
    useEffect(() => {
        setUser(props.user);
        setMuscleGroups(props.muscleGroups);
    }, [props])

    // If there is no logged in user, show the prompt with links to Login and Register pages
    if (!user) {
        return (
            <>
                <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
            </>
        )
    }

    // Show the user a form to assess their volume (# of sets performed) for some date range, filtered by muscle group 
    else return (
        <>
            <Box
                sx={{
                    marginTop: "5rem",
                    marginBottom: "1rem"
                }}>
                <TabContext value={view} aria-label="tabs" centered>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList aria-label="tabs" onChange={handleChange} centered>
                            <Tab label="Volume calculator" value={"0"} />
                            <Tab label="Lifts Progress" value={"1"} />
                        </TabList>
                    </Box>

                    <TabPanel value={"0"}>
                        <VolumeCounter muscleGroups={muscleGroups} />
                    </TabPanel>

                    <TabPanel value={"1"}>
                        <ProgressTracker muscleGroups={muscleGroups} />
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}

export default AnalyticsPage;