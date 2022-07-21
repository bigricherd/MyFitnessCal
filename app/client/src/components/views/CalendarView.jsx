import React from "react";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";

function DefaultCalendarView(props) {
    const [calEvents, setCalEvents] = React.useState([]);
    const [dbEvents, setDbEvents] = React.useState([]);

    React.useEffect(() => {
        setCalEvents(props.calEvents);
        setDbEvents(props.dbEvents);
    }, [props]);

    const onEventClick = (data) => {
        console.log("event click");
        let currentDbEvent = dbEvents.find((dbEvent) => {
            return dbEvent.id === data.id;
        });
        alert(
            "You have clicked event with: id: " +
                data.id +
                ", and title: " +
                data.summary +
                ", between " +
                data.startAt +
                " and " +
                data.endAt +
                " with comments: " +
                currentDbEvent.comments
        );
    };

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
                width: "80vw",
            }}
        >
            <Kalend
                onEventClick={onEventClick}
                onNewEventClick={onNewEventClick}
                events={calEvents}
                initialDate={new Date().toISOString()}
                hourHeight={60}
                initialView={CalendarView.WEEK}
                onPageChange={onPageChange}
                timeFormat={"24"}
                weekDayStart={"Monday"}
                language={"en"}
                showTimeLine={true}
                autoScroll={true}
            />
        </div>
    );
}

export default DefaultCalendarView;
