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

function AddSetRow(props) {

    const [set, setSet] = useState(props.set);
    useEffect(() => {
        setSet(props.set);
    }, [props]);


    return (
        <>
            <Stack direction="row" spacing={2}>
                <FormControl>
                    <TextField
                        id="reps"
                        name={`reps_${props.index}`}
                        label="Reps"
                        type="text"
                        value={props.value.reps}
                        onChange={props.handleChange}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        id="weight"
                        name={`weight_${props.index}`}
                        label={`Weight (${props.units === "lb" ? "lb" : "kg"})`}
                        type="text"
                        value={props.value.weight}
                        onChange={props.handleChange}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                </FormControl>
                <Button
                    onClick={(e) => { props.onDelete(props.index) }}
                    sx={{ color: "red" }}
                >
                    <DoDisturbOnOutlined />
                </Button>
            </Stack>
        </>
    )
}

export default AddSetRow;