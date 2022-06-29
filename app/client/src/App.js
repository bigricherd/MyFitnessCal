import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Forms from './components/pages/Forms';
import HomePage from './components/pages/HomePage';
import Nav from './components/Nav';
import Filters from './components/pages/Filters';

function App() {
  const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const url = `${baseUrl}/api/auth/getUser`
  console.log(url);

  const fetchUser = useCallback(async () => {

    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    try {
      const json = await response.json();
      setMessage(json.message);
      setUser(json.user);
      setIsFetching(false);
    } catch (e) {
      setMessage(`API call failed: ${e}`);
      setIsFetching(false);
    }

  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchUser();
  }, [fetchUser]);

  const debugText = <div>
    <p>{'« '}<strong>
      {isFetching
        ? 'Fetching user '
        : message}
    </strong>{' »'}
    </p>
    {process.env.NODE_ENV === 'production' ?
      <p>
        This is a production build.
      </p>
      : <p>
        You're not on PROD.
      </p>
    }</div>;

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Nav user={user} />
          <Routes>
            <Route exact path='/' element={<HomePage user={user} />} />
            <Route exact path='/forms' element={<Forms user={user} />} />
            <Route exact path='/filters' element={<Filters user={user} />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/login' element={<Login />} />
          </Routes>
          {debugText}
        </header>
      </div>
    </Router>
  );
}

export default App;
