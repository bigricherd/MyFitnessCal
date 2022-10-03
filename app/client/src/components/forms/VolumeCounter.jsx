import React, { useState, useEffect } from "react";
import volumeCounter from "../../hooks/volumeCounter";
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

function VolumeCounter(props) {
    const [muscleGroups, setMuscleGroups] = useState([]);

    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props]);

    // Filter hook
    const { values, handleChange, handleKeyDown, handleSubmit, error, data } =
        volumeCounter({
            initialValues: {
                fromDate: null,
                toDate: null,
                muscleGroup: "",
            }
        });

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
                                required
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
                    sx={{
                        marginTop: "1rem"
                    }}
                >
                    Count
                </Button>

                {/* {error && <Error error={error.messages} />} */}

                {/* Show number of sets for selected muscle group; rows are collapsible and show exercise breakdowns */}
                {data && (
                    <NumSetsTable
                        data={data}
                        className="mb-2"
                    />
                )}
            </Box>
        </Container>
    );
}

export default VolumeCounter;
