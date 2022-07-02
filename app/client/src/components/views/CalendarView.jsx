import React from 'react';
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";


function DefaultCalendarView() {
    const [events, setEvents] = React.useState({});

    const testEvent = [{
        id: 1,
        event: "test event",
        startAt: "2022-06-30T18:00:00.000Z",
        endAt: "2022-06-30T19:00:00.000Z",
        summary: 'test', 
        color: 'blue',
    }];
    
    React.useEffect(() => {
        setEvents(testEvent);
    }, []);
    
    const onEventClick = () => {
        console.log("event click")
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
        <div style={{ backgroundColor: "white", height: "300px" }}>
            <Kalend
            onEventClick={onEventClick}
            onNewEventClick={onNewEventClick}
            events={events}
            initialDate={new Date().toISOString()}
            hourHeight={60}
            initialView={CalendarView.WEEK}
            // disabledViews={[]}
            onPageChange={onPageChange}
            timeFormat={"24"}
            weekDayStart={"Monday"}
            // calendarIDsHidden={["work"]}
            language={"en"}
            showTimeLine={true}
            autoScroll={true}
            />
        </div>
    );
}

export default DefaultCalendarView;

