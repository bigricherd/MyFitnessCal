import { useEffect, useState } from "react";
import {
    Grid,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button
} from "@mui/material";
import ShowSetsCollapse from "../sets/ShowSetsCollapse";
import AddSetsToSessionPopup from '../sets/AddSetsToSessionPopup';
import EditSessionPopup from './EditSessionPopup';
import { formatDateSlashes } from "../../../helpers/formatDate";
import formatTime from '../../../helpers/formatTime';

function SessionData(props) {
    // Add sets popup
    const [showAddSetsPopup, setShowAddSetsPopup] = useState(false);

    const [session, setSession] = useState({
        id: props.session.id,
        title: props.session.title,
        date: new Date(props.session.start),
        start: new Date(props.session.start),
        end: new Date(props.session.end),
        comments: props.comments,
        sets: props.sets
    });
    const [exercises, setExercises] = useState(Object.keys(props.sets));

    // Edit Session popup
    const [showEditSessionPopup, setShowEditSessionPopup] = useState(false);

    useEffect(() => {
        setSession({
            id: props.session.id,
            title: props.session.title,
            date: new Date(props.session.start),
            start: new Date(props.session.start),
            end: new Date(props.session.end),
            comments: props.session.comments,
            sets: props.sets
        });
        setExercises(Object.keys(props.sets));
    }, [props]);

    return (
        <>
            <Grid container sx={{ "marginBottom": "1.5rem", maxWidth: "90%" }} spacing={1}>

                {/* Top row: Session title and date */}
                <Grid item xs={8}>
                    <Typography variant="h4">
                        {session.title}
                    </Typography>
                </Grid>

                <Grid item xs={4}>
                    <Typography variant="h5" align="right" sx={{ paddingTop: "5px" }}>
                        {formatDateSlashes(session.date)}
                    </Typography>

                </Grid>

                {/* Start time on new line */}
                <Grid item xs={6}>
                    <strong>Start: </strong>
                    {formatTime(session.start)}
                </Grid>

                {/* "Edit Session" button */}
                <Grid item xs={6} align="right">
                    <Button
                        onClick={() => { setShowEditSessionPopup(true) }}
                        size="small"
                        variant="outlined"
                        sx={{ borderWidth: "2px" }}
                    >
                        Edit Session
                    </Button>
                </Grid>

                {/* End time on new line */}
                <Grid item xs={6}>
                    <strong>End:</strong> {formatTime(session.end)}
                </Grid>

                {/* "Add sets" button */}
                <Grid item xs={6} align="right">
                    <Button
                        onClick={() => { setShowAddSetsPopup(true) }}
                        size="small"
                        variant="outlined"
                        sx={{ borderWidth: "2px" }}
                    >
                        Add Sets
                    </Button>
                </Grid>

                {session.comments &&
                    <Grid item xs={6}>
                        <strong>Comments:</strong> {session.comments}
                    </Grid>
                }


                {/* Popup that is triggered when "Add Sets" button (above) is clicked */}
                {session && <AddSetsToSessionPopup session={session} open={showAddSetsPopup} setOpen={setShowAddSetsPopup} liftState={props.liftNumSets} exercisesByUser={props.exercisesByUser} />}

                {session && <EditSessionPopup session={session} open={showEditSessionPopup} setOpen={setShowEditSessionPopup} liftState={props.liftEdited} />}

            </Grid>

            {/* Sets performed during this session */}
            {session && exercises.length > 0 ?
                <Grid container>
                    {/* This is the master table, where each row is a collapsible table with its heading being some exercise*/}
                    <TableContainer>
                        <Table>

                            {/* Table heading 'Sets'*/}
                            <TableHead>
                                <TableRow>

                                    <TableCell sx={{ borderBottom: 'unset' }}>
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: "500" }}
                                        >
                                            Sets
                                        </Typography>
                                    </TableCell>

                                </TableRow>
                            </TableHead>

                            {/* Array of collapsibles, one per exercise, each showing the sets of that exercise */}
                            <TableBody>
                                {session && exercises.map((exercise, index) =>
                                    <ShowSetsCollapse key={index} exercise={exercise} sets={session.sets[exercise]} session={session} liftState={props.liftNumSets} />
                                )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                : <Typography> No sets for this session. Add sets above.</Typography>}
        </>
    )
}

export default SessionData;