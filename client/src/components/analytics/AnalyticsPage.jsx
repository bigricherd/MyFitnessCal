import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VolumeCounter from './volume/VolumeCounter';
import ProgressTracker from './progress/ProgressTracker';
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

function AnalyticsPage(props) {
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);

    // Views
    const [view, setView] = useState("0");
    const handleChange = (event, newValue) => {
        setView(newValue);
    }

    // Update state every time props.user is updated
    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props])

    // // Show the user a form to assess their volume (# of sets performed) for some date range, filtered by muscle group 
    return (
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
                        <VolumeCounter muscleGroups={muscleGroups} units={props.units}/>
                    </TabPanel>

                    <TabPanel value={"1"}>
                        <ProgressTracker muscleGroups={muscleGroups} units={props.units}/>
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}

export default AnalyticsPage;