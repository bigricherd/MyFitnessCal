import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { useEffect } from 'react';
import SessionData from '../SessionData';
import deleteSession from '../../hooks/deleteSession';
import DeleteSessionPopup from './DeleteSessionPopup';

function SessionPopup(props) {
    console.log('SessionPopup render');

    const [data, setData] = useState(null);

    // Confirm delete popup
    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [deleteEvent, setDeleteEvent] = useState(null);

    // Add sets
    const [numSets, setNumSets] = useState(null);

    //Edit session
    const [edited, setEdited] = useState(null);

    const handleOpen = (e) => {
        setOpen(true);
        setIdToDelete(props.id);
        setDeleteEvent(e);
    }

    const handleClose = () => {
        setIdToDelete(null);
        setDeleteEvent(null);
        setOpen(false);

    }

    const handleDelete = () => {
        deleteValues.id = idToDelete;
        handleSubmitDelete(deleteEvent);
        deleteValues.id = '';
        props.idSetter(null);
        setOpen(false);
        props.openSetter(false);
    }

    const { deleteValues, numSessions, handleSubmitDelete } = deleteSession({
        id: ''
    });

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    const getSessionInfo = async () => {
        console.log('getting session info');
        console.log(props.id);
        if (props.id) {
            const data = await fetch(`${baseUrl}/api/sessions/?id=${props.id}`);
            const json = await data.json();
            console.log(json);
            setData(json);
        } else setData(null);
    }

    useEffect(() => {
        getSessionInfo();
    }, [props, numSets]);

    useEffect(() => {
        props.liftNumEdits(edited);
    }, [edited]);

    // Propagate numSessions to CalendarView, which will lift it to SessionsPage, incuding a re-fetch of sessions and re-render of events on the CalendarView
    useEffect(() => {
        props.liftNumSessions(numSessions);
    }, [numSessions])

    return (
        <>
            <Dialog
                open={props.open}
                onClose={props.onClose}
            >

                {/* Session information */}
                <DialogContent>
                    {/* Populate the dialog with session data */}
                    {data && <SessionData session={data.session} sets={data.sets} liftNumSets={setNumSets} liftEdited={setEdited} exercises={props.exercises} />}
                </DialogContent>

                <DialogActions>
                    <Button onClick={props.onClose}>
                        Back
                    </Button>

                    <Button
                        onClick={(e) => { handleOpen(e) }}
                        variant="contained"
                        sx={{ backgroundColor: "red" }}
                    >
                        Delete
                    </Button>
                </DialogActions>

                {/* Confirm dialog that appears onClick of Delete button, just above */}
                {data && <DeleteSessionPopup open={open} onClose={handleClose} handleDelete={handleDelete} title={data.session.title} />}

            </Dialog>
        </>
    )

}

export default SessionPopup;