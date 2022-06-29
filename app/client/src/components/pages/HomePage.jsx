import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage(props) {

    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(props.user)
    }, [props])

    // If there is no logged in user, show the prompt with links to Login and Register pages
    if (!user) {
        return (
            <div>
                <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
            </div>
        )
    }

    // If a user is logged in, show the welcome message
    else return (
        <div>
            Hello and welcome to MyFitnessCal
        </div>
    )

    // Using ternary operator -- is this better?
    // return (
    //     <div>
    //         {
    //             !user ?

    //                 // If there is no user logged in, then show the messsage with links to Register and Login
    //                 < div >
    //                     <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
    //                 </div>
    //                 :

    //                 // If a user is logged in, display to them the welcome messag
    //                 <div>
    //                     Hello and welcome to MyFitnessCal
    //                 </div>
    //         }
    //     </div >
    // )
}

export default HomePage;