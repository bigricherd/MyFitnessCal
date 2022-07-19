import React from "react";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";

function DefaultCalendarView(props) {
    const [events, setEvents] = React.useState([]);

    React.useEffect(() => {
        setEvents(props.events);
    }, []);

    const onEventClick = () => {
        console.log("event click");
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
                height: "300px",
                width: "700px",
            }}
        >
            <Kalend
                onEventClick={onEventClick}
                onNewEventClick={onNewEventClick}
                events={events}
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
