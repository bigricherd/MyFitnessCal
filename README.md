<h2> Overview </h2>
A React app with a calendar to visualize your training periodization and features to track your training volume and progress on lifts. Built with a PERN stack, Passport.js for authentication, and MUI for styles. </br> </br>
Developed and maintained by Chino Rodriguez with the help of Tricia Cu. </br> </br>
Try it here: https://myfitnesscal.herokuapp.com

<h2> Preview </h2>
<img src="https://user-images.githubusercontent.com/106716130/199653581-8cc5e829-e8b7-4ad0-9423-894b3a58f078.png"/>

<h2> Features (with demo GIFs)</h2>

<details>
<summary>
<h3> Exercises </h3>
</summary>
  
  <h4> Suggested Exercises </h4>
  On your first login, a popup will appear containing suggested exercises to add to your list. You can see which exercises you've selected in a sub-popup   that also allows you to un-select exercises. The list of suggested exercises can also be accessed from the Exercises page.
  <img src="https://user-images.githubusercontent.com/106716130/199435951-3d76c90e-2e0e-4d64-b45c-cf833d36e2e9.GIF" />
  
  <h4> Add Exercise </h4>
  Add an exercise to your list. Attempting to add a duplicate exercise results in an error.
  <img src="https://user-images.githubusercontent.com/106716130/199436024-d565e220-93d4-4b70-af75-8398ef9f57d9.GIF" />
  
  <h4> Delete Exercise </h4>
  Delete an exercise from your list. </br>
  <img src="https://user-images.githubusercontent.com/106716130/199436042-ac79b38d-2997-4c39-95ee-8908bac6ed25.GIF" />

</details>


<details>
    <summary>
<h3> Sessions </h3>
      </summary>

  <h4> Add Session </h4>
    <img src="https://user-images.githubusercontent.com/106716130/199436285-18a28c7a-6a20-4f91-8bc5-381698ec0cb5.GIF" />
  
  <h4> Edit Session </h4>
    <img src="https://user-images.githubusercontent.com/106716130/199436290-b8f62674-6a63-4ed0-b2f8-2fd2f881fa65.GIF" />
  
  <h4> Delete Session </h4>
    <img src="https://user-images.githubusercontent.com/106716130/199436324-7e271e9d-fe0c-4523-8e5a-4ea20cd36482.GIF"/>

  <h4> Add Sets to Session </h4>
      <img src="https://user-images.githubusercontent.com/106716130/199436358-9d3e0898-7085-4559-9aba-6cf2739749b1.GIF" />

  <h4> Delete Sets from Session </h4>
    <img src="https://user-images.githubusercontent.com/106716130/199436368-d3750582-f37e-44a1-9ddc-2b04dd78b927.GIF" />
  
</details>

    
<details>
  <summary>
<h3> Analytics </h3>
    </summary>

   <h4> Volume Counter </h4>
    Returns the number of sets performed for the chosen muscle group within the given date range. Also includes a breakdown of exercises (per muscle            group) as well as extra statistics like maximum weight and average reps per set.
          <img src="https://user-images.githubusercontent.com/106716130/199436244-17bde4de-f1d4-465a-b0d7-c17280dbdf8e.GIF"/>


  <h4> Progress Tracker </h4>
  Returns all the sets performed for the chosen exercise within the given date range, grouped by session and sorted by date in descending order, such       that the most recent session is shown first. </br>
    <img src="https://user-images.githubusercontent.com/106716130/199436257-a1f2ded7-e078-405f-bdca-124d93ca5b49.GIF" />

  </details>

<details>
  <summary>
<h3> Additional Features </h3>
    </summary>
    
  <h4> Password strength requirements </h4>
    In this example, the password lacks an uppercase letter, hence the error.
    <img src="https://user-images.githubusercontent.com/106716130/199437569-4dd5052f-e966-4e31-abc3-7ffb4c9af214.gif"/>


  <h4> Toggle dark / light theme </h4>
      <img src="https://user-images.githubusercontent.com/106716130/199437517-117859a4-00a5-4dfb-9979-066eb0ce917e.gif" />

  <h4> Time zone support </h4>
      So that calendar events (sessions) display on the calendar at the correct time. In this example, changing the user's time zone from Pacific to Eastern Time results in the session being rendered on the calendar three hours later.
            <img src="https://user-images.githubusercontent.com/106716130/199437363-bfa3cc23-66cb-48d5-bf87-23db93148c76.gif" />
  <h4> Deactivate account </h4>
  The error "user does not exist" is proof that the user "demo" was deleted.
      <img src="https://user-images.githubusercontent.com/106716130/199437335-590b55ff-9d63-44f6-95e2-74eed0d38997.gif" />

  </details>
  
  <h2> Current Limitations </h2>
  <ul>
  <li>
  Cardio exercises are not supported.
  </li>
  <li>
  Weight units are assumed to be in pounds and no validation is being done on this front.
  </li>
  <li>
  A separate list of exercises is maintained for each user. That is, "Push ups" for user A and "Push ups" for user B would occupy two separate rows in the database. This would not scale well and would have to be redesigned if the app were to grow past tens of users.
  </li>
  </ul>

<h2> Known Bugs </h2>
  <ul>
        <li> Changing a user's time zone only updates calendar event rendering, not the start / end time attributes of that Session in the database.</li>
  </ul>
    
