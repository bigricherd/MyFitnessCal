import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Sets from './components/pages/Sets';
import HomePage from './components/pages/HomePage';
import NavMUI from './components/NavMUI';
import Filters from './components/pages/Filters';
import Exercises from './components/pages/Exercises';
import formatEnum from './helpers/formatEnum';


function App() {
  const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const fetchUserUrl = `${baseUrl}/api/auth/getUser`;

  const fetchUser = useCallback(async () => {

    const response = await fetch(fetchUserUrl, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    try {
      const json = await response.json();
      setMessage(json.message);
      setUser(json.user);
      setUserId(json.id);
      setIsFetching(false);
    } catch (e) {
      setMessage(`API call failed: ${e}`);
      setIsFetching(false);
    }

  }, [fetchUserUrl]);

  let muscleGroupsArr = [];
  let muscleGroupsForFiltersArr = [];
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [muscleGroupsForFilters, setMuscleGroupsForFilters] = useState([]);
  const fetchMuscleGroupsUrl = `${baseUrl}/api/enums`;

  const fetchMuscleGroups = useCallback(async () => {
    const data = await fetch(fetchMuscleGroupsUrl);
    const json = await data.json();
    muscleGroupsArr = formatEnum(json.muscleGroups);
    muscleGroupsForFiltersArr = formatEnum(json.muscleGroups);
    muscleGroupsForFiltersArr.unshift('All');

    setMuscleGroups(muscleGroupsArr);
    setMuscleGroupsForFilters(muscleGroupsForFiltersArr);
  }, [fetchMuscleGroupsUrl])

  useEffect(() => {
    setIsFetching(true);
    fetchUser();
    fetchMuscleGroups();
  }, [fetchUser, fetchMuscleGroups]);

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
          <NavMUI user={user} />
          <Routes>
            <Route exact path='/' element={<HomePage user={user} />} />
            <Route exact path='/sets' element={<Sets user={user} userId={userId} />} />
            <Route exact path='/exercises' element={<Exercises user={user} userId={userId} muscleGroups={muscleGroups} />} />
            <Route exact path='/filters' element={<Filters user={user} muscleGroups={muscleGroupsForFilters} />} />
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
