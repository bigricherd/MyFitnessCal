import React, { useState } from 'react';
import useForm from '../../hooks/useFilterForm';
import NumSetsTable from '../tables/NumSetsTable';
import Dropdown from '../Dropdown';
import { useEffect } from 'react';

function MuscleGroupFilter(props) {
    const [muscleGroups, setMuscleGroups] = useState([]);
    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props]);

    const { values, handleChange, handleKeyDown, handleSubmit, error, data } = useForm({
        initialValues: {
            fromDate: '',
            toDate: '',
            muscleGroup: ''
        },
        slug: 'api/stats/setsPerMuscle'
    });

    // if (!user) {
    //     return (
    //         <div>
    //             <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
    //         </div>
    //     )
    // } else
    return (
        <div>
            <div className="card-shadow mt-5 pt-5">
                <div className="card-body d-flex flex-column align-items-center">
                    <h5 className="card-title display-4 my-2">View Total Sets per Muscle Group</h5>
                    <form action="#" method="POST" onSubmit={handleSubmit} className="mb-3">
                        <div className="mb-3 text-start">
                            <label htmlFor="fromDate" name="fromDate" className='form-label'>From date:</label>
                            <input type="text" className="form-control" placeholder="start date" id="fromDate" name="fromDate" value={values.fromDate} onChange={handleChange} onKeyDown={handleKeyDown} required />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="toDate" name="toDate" className='form-label'>To date:</label>
                            <input type="text" className="form-control" placeholder="end date" id="toDate" name="toDate" value={values.toDate} onChange={handleChange} onKeyDown={handleKeyDown} required />
                        </div>


                        <div className="mb-3 text-start">
                            <label htmlFor="muscleGroup" className='form-label d-block'>Muscle Group</label>
                            <Dropdown name={'muscleGroup'} id={'muscleGroup'} options={muscleGroups} value={values.muscleGroup} onChange={handleChange} onKeyDown={handleKeyDown} />
                            <input type="text" className="form-control d-none" placeholder="" id="muscleGroup" name="muscleGroup" value={values.muscleGroup} onChange={handleChange} onKeyDown={handleKeyDown} />
                        </div>

                        <button className="btn btn-primary mb-3">Crunch the numbers</button>
                    </form>
                    {/* {error && <Error error={error.messages} />} */}
                    {data && data.results && <NumSetsTable data={Object.entries(data.results)} type={'perMuscleGroup'} />}
                    <hr></hr>
                    {data && data.perExercise && <NumSetsTable data={Object.entries(data.perExercise)} type={'perExercise'} />}
                </div>
            </div>

        </div>
    )
}

export default MuscleGroupFilter;