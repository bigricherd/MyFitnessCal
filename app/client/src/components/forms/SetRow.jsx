import {
    Grid,
    Typography,
    FormControl,
    TextField,
    Stack,
    Button
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DoDisturbOnOutlined } from '@mui/icons-material';
import Dropdown from '../Dropdown';

function SetRow(props) {

    const [set, setSet] = useState(props.set);
    useEffect(() => {
        setSet(props.set);
    }, [props]);


    return (
        <>

            <Grid
                container
                spacing={0}
                alignItems="center"
                justifyContent="center"
                columns={{ xs: 14 }}
            >


                <Stack direction="row" spacing={2}>
                    <Grid item xs={3}>
                        <FormControl>
                            <TextField
                                id="reps"
                                name={`reps_${props.index}`}
                                label="Reps"
                                type="number"
                                value={props.value.reps}
                                onChange={props.handleChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl>
                            <TextField
                                id="weight"
                                name={`weight_${props.index}`}
                                label="Weight (lb)"
                                type="number"
                                value={props.value.weight}
                                onChange={props.handleChange}
                                required
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={7}>
                        <FormControl fullWidth>
                            <Dropdown
                                id="exercise"
                                name={`exercise_${props.index}`}
                                options={props.exercises}
                                value={props.value.exercise}
                                onChange={props.handleChange}
                            />
                        </FormControl>
                    </Grid>
                </Stack>

                <Grid item xs={1}>
                    <Button
                        onClick={(e) => { props.onDelete(props.index) }}
                        sx={{ color: "red" }}
                    >
                        <DoDisturbOnOutlined />
                    </Button>
                </Grid>

            </Grid>
        </>
    )
}

export default SetRow;