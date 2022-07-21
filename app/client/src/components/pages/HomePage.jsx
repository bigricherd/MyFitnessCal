import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage(props) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(props.user);
    }, [props]);

    return (
        <>
            {user ? (
                <div>Hello and welcome to MyFitnessCal</div>
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

export default HomePage;
