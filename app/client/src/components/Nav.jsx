import axios from 'axios';
import { Link } from 'react-router-dom';

// ------ A simple navbar that leads us to the various pages / components we currently have ------
function Nav(props) {
    let navLinkClasses = 'nav-item nav-link';

    let navbarContents = null;

    const handleLogout = async (e) => {
        e.preventDefault();
        const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/auth/logout`, { credentials: "include" });
        if (res.ok) {
            window.location = '/';
        }
    }

    // Assign navbar contents, selection depends on whether a user is logged in
    if (props.user) {
        navbarContents = <div className="navbar-nav ms-auto">
            <Link to='/forms' className={navLinkClasses}>Forms</Link>
            <Link to='/filters' className={navLinkClasses}>Filters</Link>
            <form action='#' onSubmit={handleLogout} className={navLinkClasses}><button className="border-0 bg-light text-muted">Logout | <span className="text-success">{props.user}</span></button></form>
        </div>
    } else {
        navbarContents = <div className="navbar-nav ms-auto">
            <Link to='/register' className={navLinkClasses}>Register</Link>
            <Link to='/login' className={navLinkClasses}>Login</Link>
        </div>
    }

    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid mx-2">
                <a className="navbar-brand" href="/">MyFitnessCal</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar">
                    {navbarContents}
                </div>
            </div>
        </nav>
    )
}

export default Nav;