import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography
} from '@mui/material';
import formatExercise from '../../helpers/formatExercise';
import { DoDisturbOnOutlined } from '@mui/icons-material';

function ShowSelectedPopup(props) {
    return (
        <Dialog open={props.open}>
            <DialogTitle>
                Exercises to add
            </DialogTitle>

            <DialogContent>
                {props.exercises.length === 0 ?
                    <Typography>Select an exercise to get started.</Typography>
                    : <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Exercise
                                    </TableCell>
                                    <TableCell>
                                        Muscle Group
                                    </TableCell>
                                    <TableCell>
                                        {/* Filler */}
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {props.exercises && props.exercises.map((item, index) => (
                                    <TableRow key={item}>
                                        <TableCell>
                                            {formatExercise(item.split(":")[0])}
                                        </TableCell>
                                        <TableCell>
                                            {formatExercise(item.split(":")[1])}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => {
                                                    let exercises = props.exercises.slice();
                                                    let item = exercises[index];

                                                    // Return item to options
                                                    let options = props.options.slice();
                                                    options.push(item);
                                                    props.setOptions(options);

                                                    // Remove item from exercises
                                                    let tmp = [...exercises.slice(0, index), ...exercises.slice(index + 1)];
                                                    props.setExercises(tmp);

                                                }}
                                                sx={{ color: "red" }}
                                            >
                                                <DoDisturbOnOutlined />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={props.onClose}
                >
                    Back
                </Button>
            </DialogActions>

        </ Dialog >
    )
}

export default ShowSelectedPopup;