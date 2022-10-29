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
        console.log("event click");
        console.log(data);
        let currentDbEvent = dbEvents.find((dbEvent) => {
            return dbEvent.id === data.id;
        });
        console.log(currentDbEvent); // coming out undefined

        // Show popup containing corresponding Session data
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

    // TODO: Edit Session start and end times on event drag
    const onEventDragFinish = (prevEvent, updatedEvent) => {
        console.log('an event was dragged');
        console.log(prevEvent);
        console.log(updatedEvent);
    }

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
            <ShowSession
                id={sessionId}
                idSetter={setSessionId}
                open={popupOpen}
                openSetter={setPopupOpen}
                onClose={handlePopupClose}
                liftNumSessions={props.liftNumSessions}
                liftNumEdits={props.liftNumEdits}
                exercisesByUser={props.exercisesByUser} />
            <Kalend
                onEventClick={onEventClick}
                onNewEventClick={onNewEventClick}
                onEventDragFinish={onEventDragFinish}
                events={calEvents}
                initialDate={new Date().toISOString()}
                hourHeight={60}
                initialView={CalendarView.WEEK}
                onPageChange={onPageChange}
                timeFormat={"24"}
                weekDayStart={"Monday"}
                //timezone={"America/Los_Angeles"}
                timezone={props.timezone}
                language={"en"}
                showTimeLine={true}
                autoScroll={true}
            />
        </div>
    );
}

export default DefaultCalendarView;
