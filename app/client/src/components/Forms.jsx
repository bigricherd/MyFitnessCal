import React, { useState } from 'react';
import AddSet from './AddSet';
import AddExercise from './AddExercise';

// ------ A forms page with a button group to select which form to view ------
function Forms() {

    const [one, setOne] = useState(true);
    const addSet = <AddSet />;
    const addExercise = <AddExercise />;


    return (
        <div className="mt-5 pt-5">
            <div className="btn-group mb-3" role="group" aria-label="Toggle between two components">
                <input type="radio" className="btn-check" name="btnradio" id="pending" checked={one} onChange={() => setOne(true)}></input>
                <label className="btn btn-outline-light" htmlFor="pending">Add Set</label>

                <input type="radio" className="btn-check" name="btnradio" id="completed" checked={!one} onChange={() => setOne(false)}></input>
                <label className="btn btn-outline-light" htmlFor="completed">Add Exercise</label>
            </div>

            {one ? addSet : addExercise}
        </div>
    )
}

export default Forms;