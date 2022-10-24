import React, { useState, useEffect } from "react";
import volumeCounter from "../../hooks/volumeCounter";
import VolumeTable from "../tables/VolumeTable";
import Dropdown from "../Dropdown";
import {
    FormControl,
    TextField,
    Box,
    Stack,
    Button,
    Typography,
    Alert
} from "@mui/material";
import Container from "@mui/material/Container";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// TODO store muscle Groups array here

function VolumeCounter(props) {
    const [muscleGroups, setMuscleGroups] = useState([]);

    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props]);

    // Filter hook
    const { values, handleChange, handleKeyDown, handleSubmit, error, prevError, data } =
        volumeCounter({
            initialValues: {
                fromDate: null,
                toDate: null,
                muscleGroup: "",
            },
            muscleGroups: props.muscleGroups
        });

    // Setup to show feedback messages -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return (
        <Container fixed>

            {/* Heading */}
            <Typography
                component="div"
                sx={{
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    fontWeight: "400",
                    fontSize: "1.5em"
                }}>
                Training Volume Calculator
            </Typography>

            <Stack
                spacing={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Box onSubmit={handleSubmit} component="form" autoComplete="off">

                    {/* Form inputs */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                        <Stack spacing={2}>

                            {/* From date input */}
                            <FormControl >
                                <DatePicker
                                    views={["day"]}
                                    label="From Date"
                                    value={values.fromDate}
                                    onChange={(newValue) => {
                                        let event = {
                                            target: {
                                                value: newValue,
                                                name: "fromDate",
                                            },
                                        };
                                        handleChange(event);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                            </FormControl>

                            {/* To date input */}
                            <FormControl>
                                <DatePicker
                                    views={["day"]}
                                    label="To Date"
                                    value={values.toDate}
                                    onChange={(newValue) => {
                                        let event = {
                                            target: {
                                                value: newValue,
                                                name: "toDate",
                                            },
                                        };
                                        handleChange(event);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                            </FormControl>

                            {/* Muscle group input */}
                            <FormControl rules={{ required: true }} fullWidth>
                                <Dropdown
                                    name="muscleGroup"
                                    id="muscleGroup"
                                    options={muscleGroups}
                                    value={values.muscleGroup || ''}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                />
                            </FormControl>
                        </Stack>
                    </LocalizationProvider>

                    {/* Submit button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{
                            marginTop: "1rem"
                        }}
                    >
                        Count
                    </Button>

                </Box>

                {/* Show number of sets for selected muscle group; rows are collapsible and show exercise breakdowns */}
                <Stack >
                    {data && (
                        <VolumeTable
                            data={data}
                            className="mb-2"
                        />
                    )}
                </Stack>

            </Stack>

            {/* Feedback messages */}
            {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}

        </Container>
    );
}

export default VolumeCounter;
