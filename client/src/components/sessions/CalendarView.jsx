import React from "react";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";
import ShowSession from "./show-edit-delete/ShowSession";

function DefaultCalendarView(props) {
    const [calEvents, setCalEvents] = React.useState([]);
    const [dbEvents, setDbEvents] = React.useState([]);
    const [popupOpen, setPopupOpen] = React.useState(false);
    const [sessionId, setSessionId] = React.useState(null);

    React.useEffect(() => {
        setCalEvents(props.calEvents);
        setDbEvents(props.dbEvents);
    }, [props]);

    const onEventClick = (data) => {
        let currentDbEvent = dbEvents.find((dbEvent) => {
            return dbEvent.id === data.id;
        });

        // Show popup containing corresponding Session data
        setSessionId(data.id);
        setPopupOpen(true);
    };

    const handlePopupClose = () => {
        setSessionId(null);
        setPopupOpen(false);
    }

    const onNewEventClick = (data) => {

        const msg = `New event click action\n\n Callback data:\n\n${JSON.stringify(
            {
                event: "click event ",
                day: data.day,
                hour: data.hour,
                startAt: data.startAt,
                endAt: data.endAt,
                view: data.view,
            }
        )}`;
    };

    const onPageChange = () => {
        //("page change");
    };

    // Nice to have: Edit Session start and end times on event drag
    const onEventDragFinish = (prevEvent, updatedEvent) => {
    }

    return (
        <div
            style={{
                backgroundColor: props.darkMode ? "black" : "white",
                height: "75vh",
                maxWidth: "90%",
                margin: "auto"
            }}
        >
            <ShowSession
                id={sessionId}
                idSetter={setSessionId}
                open={popupOpen}
                openSetter={setPopupOpen}
                onClose={handlePopupClose}
                liftNumSessions={props.liftNumSessions}
                liftNumEdits={props.liftNumEdits}
                exercisesByUser={props.exercisesByUser}
                units={props.units}
            />
            <Kalend
                onEventClick={onEventClick}
                onNewEventClick={onNewEventClick}
                onEventDragFinish={onEventDragFinish}
                events={calEvents}
                initialDate={new Date().toISOString()}
                hourHeight={60}
                initialView={CalendarView.MONTH}
                onPageChange={onPageChange}
                timeFormat={"24"}
                weekDayStart={"Monday"}
                timezone={props.timezone}
                language={"en"}
                showTimeLine={true}
                autoScroll={true}
            />
        </div>
    );
}

export default DefaultCalendarView;
