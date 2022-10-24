import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    FormControl,
    Button,
    TextField,
    Stack,
    Container,
    Alert
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Dropdown from '../Dropdown';
import progressTracker from '../../hooks/progressTracker';
import ProgressTable from '../tables/ProgressTable';
import ProgressChart from '../ProgressChart';

// TODO store muscle Groups array here

function ProgressTracker(props) {
    const [exercises, setExercises] = useState(null);
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups.slice(1));
    const [data, setData] = useState(null);

    const fetchExercises = async () => {
        const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';
        const res = await axios({
            method: 'GET',
            url: `${baseUrl}/api/stats/exercisesGrouped`,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            withCredentials: true
        });
        setExercises(res.data);
    }

    // Fetch exercises on initial render
    useEffect(() => {
        fetchExercises();
    }, []);

    const { values, handleChange, handleKeyDown, handleSubmit, error, prevError, response } = progressTracker({
        muscleGroup: 'Select a muscle group',
        exercise: '',
        fromDate: null,
        toDate: null,
        exerciseOptions: []
    }
    );

    useEffect(() => {
        setData(response);
    }, [response]);

    useEffect(() => {
        if (values.muscleGroup) {
            let temp = values.muscleGroup.toLowerCase().split(" ").join("_");
            values.exercise = '';
            setExerciseOptions(exercises[temp]);
            values.exerciseOptions = exercises[temp];
        }
    }, [values.muscleGroup]);

    // Setup to show feedback messages -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return (
        <>
            <Container>
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    {/* Heading */}
                    <Typography variant="h5" gutterBottom> Progress Tracker for Lifts </Typography>

                    {/* Form */}
                    <Box onSubmit={handleSubmit} component="form" autoComplete="off">
                        <Stack spacing={2}>
                            {/* Muscle group dropdown */}
                            <FormControl fullWidth>
                                <Dropdown
                                    name="muscleGroup"
                                    id="muscleGroup"
                                    options={muscleGroups}
                                    value={values.muscleGroup || ''}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                />
                            </FormControl>

                            {/* Exercise dropdown */}
                            <FormControl fullWidth>
                                <Dropdown
                                    name="exercise"
                                    id="exercise"
                                    options={exerciseOptions}
                                    value={values.exercise || ''}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                />
                            </FormControl>

                            {/* Date pickers */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>

                                {/* From date input */}
                                <FormControl>
                                    <DatePicker
                                        views={["day"]}
                                        label="From Date"
                                        value={values.fromDate || null}
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
                                        required="no"
                                    />
                                </FormControl>

                                {/* To date input */}
                                <FormControl>
                                    <DatePicker
                                        views={["day"]}
                                        label="To Date"
                                        value={values.toDate || null}
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

                            </LocalizationProvider>
                        </Stack>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                marginTop: "1rem"
                            }}
                        >
                            Apply
                        </Button>

                    </Box>

                    {/* Results */}
                    <Stack>
                        {data && <ProgressTable data={data} exercise={values.exercise} />}
                    </Stack>

                </Stack>

                {/* Feedback messages */}
                {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}

                {/* {data && <ProgressChart data={data} exercise={values.exercise} />} */}
            </Container>
        </>
    )
}

export default ProgressTracker;