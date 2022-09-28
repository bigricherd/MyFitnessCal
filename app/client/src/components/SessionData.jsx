import { useEffect, useState } from "react";
import {
    Box,
    Collapse,
    Grid,
    Typography,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button
} from "@mui/material";
import formatEnum from '../helpers/formatEnum';
import CollapsibleTable from "./tables/CollapsibleTable";
import AddSetsToSessionPopup from './popups/AddSetsToSessionPopup';

function SessionData(props) {
    console.log('SessionData render');
    console.log(props);

    // Add sets popup
    const [showAddSetsPopup, setShowAddSetsPopup] = useState(false);

    const convertTime = (t) => {
        const date = new Date(t);
        let ap = 'AM';
        let hours = date.getHours();

        if (hours >= 12) ap = 'PM';
        if (hours !== 12) {
            hours = (hours % 12).toString();
        }
        let minutes = date.getMinutes().toString();
        if (minutes < 10) minutes = "0" + minutes;

        return hours + ":" + minutes + " " + ap;

    }

    const getDate = (t) => {
        const date = new Date(t);

        let month = date.getMonth() + 1;
        if (month < 10) month = "0" + month;

        let day = date.getDate();
        if (day < 10) day = "0" + day;

        const year = date.getFullYear();

        return month + "/" + day + "/" + year;
    }

    const [session, setSession] = useState({
        id: props.session.id,
        title: props.session.title,
        date: getDate(props.session.start),
        start: convertTime(props.session.start),
        end: convertTime(props.session.end),
        sets: props.sets
    });
    const [exercises, setExercises] = useState(Object.keys(props.sets));

    useEffect(() => {
        setSession({
            id: props.session.id,
            title: props.session.title,
            date: getDate(props.session.start),
            start: convertTime(props.session.start),
            end: convertTime(props.session.end),
            sets: props.sets
        });
        setExercises(Object.keys(props.sets));
    }, [props])

    const liftState = (value) => {
        props.liftState(value);
    }

    return (
        <>
            <Grid container sx={{ "marginBottom": "1.5rem" }} spacing={1}>

                {/* Top row: Session title and date */}
                <Grid item xs={8}>
                    <Typography variant="h4">
                        {session.title}
                    </Typography>
                </Grid>

                <Grid item xs={4}>
                    <Typography variant="h5" align="right" sx={{ paddingTop: "5px" }}>
                        {session.date}
                    </Typography>

                </Grid>

                {/* Start time on new line */}
                <Grid item xs={8}>
                    <strong>Start: </strong>
                    {session.start}
                </Grid>

                {/* End time on new line */}
                <Grid item xs={6}>
                    <strong>End:</strong> {session.end}
                </Grid>

                <Grid item xs={6} align="right">
                    <Button
                        onClick={() => { setShowAddSetsPopup(true) }}
                        variant="contained"
                    >
                        Add Sets
                    </Button>
                </Grid>

                {/* Popup that is triggered when "Add Sets" button (above) is clicked */}
                {session && <AddSetsToSessionPopup session={session} open={showAddSetsPopup} setOpen={setShowAddSetsPopup} liftState={liftState} exercises={props.exercises} />}

            </Grid>

            {/* Sets performed during this session */}
            <Grid container>
                {/* This is the master table, where each row is a collapsible table with its heading being some exercise*/}
                <TableContainer>
                    <Table>

                        {/* Table heading 'Sets' */}
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

                        {/* Array of collapsible tables, one per exercise, each showing the sets of that exercise */}
                        <TableBody>
                            {session && exercises.map((exercise, index) => {
                                console.log(exercise);
                                console.log(index);
                                return <CollapsibleTable key={index} exercise={exercise} sets={session.sets[exercise]} session={session} liftState={liftState} />
                            })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    )
}

export default SessionData;