import { Link } from 'react-router-dom';

// ------ A simple navbar that leads us to the various pages / components we currently have ------
function Nav() {
    let navLinkClasses = 'nav-item nav-link';

    let navbarNav = <div className="navbar-nav ms-auto">
        <Link to='/register' className={navLinkClasses}>Register</Link>
        <Link to='/login' className={navLinkClasses}>Login</Link>
        <Link to='/forms' className={navLinkClasses}>Forms</Link>
    </div>;


    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid mx-2">
                <a className="navbar-brand" href="/">MyFitnessCal</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar">
                    {navbarNav}
                </div>
            </div>
        </nav>
    )
}

export default Nav;