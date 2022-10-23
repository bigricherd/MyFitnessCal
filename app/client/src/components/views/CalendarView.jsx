import React from "react";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";
import SessionPopup from "../popups/SessionPopup";

function DefaultCalendarView(props) {
    console.log('calendar render');
    const [calEvents, setCalEvents] = React.useState([]);
    const [dbEvents, setDbEvents] = React.useState([]);
    const [popupOpen, setPopupOpen] = React.useState(false);
    const [sessionId, setSessionId] = React.useState(null);

    React.useEffect(() => {
        setCalEvents(props.calEvents);
        setDbEvents(props.dbEvents);
    }, [props]);

    const onEventClick = (data) => {
        console.log("event click");
        console.log(data);
        let currentDbEvent = dbEvents.find((dbEvent) => {
            return dbEvent.id === data.id;
        });
        console.log(currentDbEvent); // coming out undefined

        setSessionId(data.id);
        setPopupOpen(true);
    };

    const handlePopupClose = () => {
        setSessionId(null);
        setPopupOpen(false);
    }

    const onNewEventClick = (data) => {
        // console.log(data.event);

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
        console.log(msg);
        console.log(data);
    };

    const onPageChange = () => {
        console.log("page change");
    };

    return (
        // temporary styles, will fix later
        <div
            style={{
                backgroundColor: "white",
                height: "75vh",
                maxWidth: "1000px",
                margin: "auto"
            }}
        >
            <SessionPopup
                id={sessionId}
                idSetter={setSessionId}
                open={popupOpen}
                openSetter={setPopupOpen}
                onClose={handlePopupClose}
                liftNumSessions={props.liftNumSessions}
                liftNumEdits={props.liftNumEdits}
                exercises={props.exercises} />
            <Kalend
                onEventClick={onEventClick}
                onNewEventClick={onNewEventClick}
                events={calEvents}
                initialDate={new Date().toISOString()}
                hourHeight={60}
                initialView={CalendarView.MONTH}
                onPageChange={onPageChange}
                timeFormat={"24"}
                weekDayStart={"Monday"}
                timezone={"America/Vancouver"}
                language={"en"}
                showTimeLine={true}
                autoScroll={true}
            />
        </div>
    );
}

export default DefaultCalendarView;
