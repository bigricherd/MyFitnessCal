import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DefaultCalendarView from "../views/CalendarView";

function SessionsPage(props) {
    const [user, setUser] = useState(null);
    const [calEvents, setCalEvents] = useState([]);
    const [dbEvents, setDbEvents] = useState([]);

    const getAllSessions = async () => {
        const baseUrl = "http://localhost:5000";
        const data = await fetch(`${baseUrl}/api/sessions/all`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const json = await data.json();
        convertToCalendarEvents(json);
        console.log(calEvents);
        console.log(dbEvents);
    };

    const convertToCalendarEvents = (sessions) => {
        let calendarEvents = sessions.map((session) => ({
            id: session.id,
            startAt: session.startdatetime,
            endAt: session.enddatetime,
            summary: session.title,
        }));
        console.log(calendarEvents);
        setCalEvents(calendarEvents);
        setDbEvents(sessions);
    };

    // Update state every time props.user is updated
    useEffect(() => {
        getAllSessions();
        setUser(props.user);
    }, [props]);

    return (
        <>
            {user ? (
                <div>
                    CalendarView
                    <DefaultCalendarView
                        calEvents={calEvents}
                        dbEvents={dbEvents}
                    />
                </div>
            ) : (
                <div>
                    <p>
                        <Link to={"/register"} className="text-decoration-none">
                            Register
                        </Link>{" "}
                        or{" "}
                        <Link to={"/login"} className="text-decoration-none">
                            Login
                        </Link>{" "}
                        first
                    </p>
                </div>
            )}
        </>
    );
}

export default SessionsPage;
