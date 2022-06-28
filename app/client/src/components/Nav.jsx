import { Link } from 'react-router-dom';

// ------ A simple navbar that leads us to the various pages / components we currently have ------
function Nav(props) {
    let navLinkClasses = 'nav-item nav-link';

    let navbarContents = null;

    // Assign navbar contents, selection depends on whether a user is logged in
    if (props.user) {
        navbarContents = <div className="navbar-nav ms-auto">
            <Link to='/forms' className={navLinkClasses}>Forms</Link>
            <form action='/api/auth/logout' className={navLinkClasses} method='POST'><button className="border-0 bg-light text-muted">Logout | <span className="text-success">{props.user.username}</span></button></form>
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