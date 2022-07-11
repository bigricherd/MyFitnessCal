import React, { useState, useEffect } from "react";
import useForm from "../../hooks/useFilterForm";
import NumSetsTable from "../tables/NumSetsTable";
import Dropdown from "../Dropdown";
import { FormControl, TextField, Box, Stack, Button } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function MuscleGroupFilter(props) {
    const [muscleGroups, setMuscleGroups] = useState([]);

    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props]);

    const { values, handleChange, handleKeyDown, handleSubmit, error, data } =
        useForm({
            initialValues: {
                fromDate: new Date(),
                toDate: new Date(),
                muscleGroup: "",
            },
            slug: "api/stats/setsPerMuscle",
        });

    return (
        <Container fixed>
            <Typography variant="h4" gutterBottom component="div">
                View Total Sets per Muscle Group
            </Typography>
            <Box component="form" autoComplete="on">
                <Stack spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                                    <TextField {...params} helperText={null} />
                                )}
                                onKeyDown={handleKeyDown}
                            />
                        </FormControl>
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
                                    <TextField {...params} helperText={null} />
                                )}
                                onKeyDown={handleKeyDown}
                            />
                        </FormControl>
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Crunch the numbers
                </Button>
                {/* {error && <Error error={error.messages} />} */}
                {data && data.results && (
                    <NumSetsTable
                        data={Object.entries(data.results)}
                        type={"perMuscleGroup"}
                    />
                )}
                <hr></hr>
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
