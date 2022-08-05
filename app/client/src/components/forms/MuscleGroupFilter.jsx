import React, { useState, useEffect } from "react";
import useForm from "../../hooks/useFilterForm";
import NumSetsTable from "../tables/NumSetsTable";
import Dropdown from "../Dropdown";
import {
    FormControl,
    TextField,
    Box,
    Stack,
    Button,
    Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function MuscleGroupFilter(props) {
    const [muscleGroups, setMuscleGroups] = useState([]);

    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props]);

    // Filter hook
    const { values, handleChange, handleKeyDown, handleSubmit, error, data } =
        useForm({
            initialValues: {
                fromDate: null,
                toDate: null,
                muscleGroup: "",
            },
            slug: "api/stats/setsPerMuscle",
        });

    return (
        <Container fixed>

            {/* Heading */}
            <Typography variant="h4" gutterBottom component="div">
                View Total Sets per Muscle Group
            </Typography>

            <Box component="form" autoComplete="on">

                {/* Form inputs */}
                <Stack spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                        {/* From date input */}
                        <FormControl>
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
                        <FormControl>
                            <Dropdown
                                name="muscleGroup"
                                id="muscleGroup"
                                options={muscleGroups}
                                value={values.muscleGroup}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FormControl>
                    </LocalizationProvider>
                </Stack>

                {/* Submit button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Crunch the numbers
                </Button>

                {/* {error && <Error error={error.messages} />} */}

                {/* Show number of sets for selected muscle group */}
                {data && data.results && (
                    <NumSetsTable
                        data={Object.entries(data.results)}
                        type={"perMuscleGroup"}
                        className="mb-2"
                    />
                )}

                {/* Show per-exercise breakdown of sets, as well as statistics for each exercise */}
                {data && data.perExercise && (
                    <NumSetsTable
                        data={Object.entries(data.perExercise)}
                        type={"perExercise"}
                    />
                )}
            </Box>
        </Container>
    );
}

export default MuscleGroupFilter;
