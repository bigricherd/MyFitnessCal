# MyFitnessCal

<h2> Overview </h2>
A React app with a calendar to visualize your training periodization and features to track your training volume and progress on lifts.

<h2> Features </h2>

<h3> Exercises </h3>

<details>
  <summary>
    <h4> Suggested Exercises </h4>
  </summary>
  <img src="https://user-images.githubusercontent.com/106716130/199360393-41aacfba-db92-4a65-85b2-43cc1b94885f.gif" />

</details>

<details>
  <summary>
    <h4> Add Exercise </h4>
  </summary>
  

https://user-images.githubusercontent.com/106716130/199360518-f1760680-0308-437e-a600-59c0ead20ca0.mov


</details>

<details>
  <summary>
    <h4> Delete Exercise </h4>
  </summary>
  ![deleteExercise](https://user-images.githubusercontent.com/106716130/199360645-9c03e692-b8e9-4aec-a18c-fe1a310e52bb.gif)


https://user-images.githubusercontent.com/106716130/199360671-3162687c-1f53-4039-967b-bcafc554d10f.mov


  
</details>


<h3> Sessions </h3>

<details>
  <summary>
    <h4> Add Session </h4>
  </summary>
</details>

<details>
  <summary>
    <h4> Edit Session </h4>
  </summary>
</details>

<details>
  <summary>
    <h4> Delete Session </h4>
  </summary>
</details>

<details>
  <summary>
    <h4> Add Sets to Session </h4>
  </summary>
</details>

<details>
  <summary>
    <h4> Delete Sets from Session </h4>
  </summary>
</details>

<h3> Analytics </h3>
<details>
  <summary>
    <h4> Volume Counter </h4>
  </summary>
  Returns the number of sets performed for the chosen muscle group within the given date range. Also includes a breakdown of exercises (per muscle group) as well as extra statistics like maximum weight and average reps per set.
</details>

<details>
  <summary>
    <h4> Progress Tracker </h4>
  </summary>
  Returns all the sets performed for the chosen exercise within the given date range, grouped by session and sorted by date in descending order, such that the most recent session is shown first.
</details>

<h3> Additional Settings </h3>

<details>
  <summary>
    <h4> Toggle dark / light themes </h4>
  </summary>
</details>

<details>
  <summary>
    <h4> Time zone support </h4>
  </summary>
  So that calendar events (sessions) display on the calendar at the correct time.
</details>

<details>
  <summary>
    <h4> Deactivate account </h4>
  </summary>
</details>

<h2> Known Bugs <h2>
  <ul>
    <li> Suggested Exercises continues to pop up on Sessions page if user only hits 'SKIP' button and does not use it to add exercises.</li>
        <li> Changing a user's time zone only updates calendar event rendering, not the start / end time attributes of that Session in the database.</li>
        <li> Add session popup sometimes does not close on a successful CREATE Session.</li>
  </ul>
    
