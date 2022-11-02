<h2> Overview </h2>
A React app with a calendar to visualize your training periodization and features to track your training volume and progress on lifts. Built with a PERN stack, Passport.js for authentication, and MUI for styles. </br> </br>
Developed and maintained by Chino Rodriguez with the help of Tricia Cu. </br> </br>
Try it here: https://myfitnesscal.herokuapp.com

<h2> Preview </h2>
<img src="https://user-images.githubusercontent.com/106716130/199367479-3157d927-735e-49a1-a91f-8a42da579a30.png"/>

<h2> Features (with demo GIFs)</h2>

<details>
<summary>
<h3> Exercises </h3>
</summary>
  
  <h4> Suggested Exercises </h4>
  On your first login, a popup will appear containing suggested exercises to add to your list. You can see which exercises you've selected in a sub-popup   that also allows you to un-select exercises. The list of suggested exercises can also be accessed from the Exercises page.
    <img src="https://user-images.githubusercontent.com/106716130/199360393-41aacfba-db92-4a65-85b2-43cc1b94885f.gif" />
  
  <h4> Add Exercise </h4>
  Add an exercise to your list. Attempting to add a duplicate exercise results in an error.
  <img src="https://user-images.githubusercontent.com/106716130/199361142-609194b9-7231-4f25-be5e-128c24280ead.gif" />
  
  <h4> Delete Exercise </h4>
  Delete an exercise from your list. </br>
  <img src="https://user-images.githubusercontent.com/106716130/199360645-9c03e692-b8e9-4aec-a18c-fe1a310e52bb.gif" />

</details>


<details>
    <summary>
<h3> Sessions </h3>
      </summary>

  <h4> Add Session </h4>
    <img src="https://user-images.githubusercontent.com/106716130/199361529-3432734d-1367-4f28-97f0-94360d5581f8.gif" />
  
  <h4> Edit Session </h4>
    <img src="https://user-images.githubusercontent.com/106716130/199361537-45ccbfbe-84c7-448a-834f-4372d954f145.gif" />
  
  <h4> Delete Session </h4>
    <img src="https://user-images.githubusercontent.com/106716130/199361548-c7e455d1-06bd-44c4-9c37-2c20c6eef34b.gif" />

  <h4> Add Sets to Session </h4>
      <img src="https://user-images.githubusercontent.com/106716130/199361550-97b195ad-7a0a-4cf1-b558-a70847c14620.gif" />

  <h4> Delete Sets from Session </h4>
    <img src="https://user-images.githubusercontent.com/106716130/199361555-9a16f8b9-10e3-43fa-8c86-01d8f4605516.gif" />
  
</details>

    
<details>
  <summary>
<h3> Analytics </h3>
    </summary>

   <h4> Volume Counter </h4>
    Returns the number of sets performed for the chosen muscle group within the given date range. Also includes a breakdown of exercises (per muscle            group) as well as extra statistics like maximum weight and average reps per set.
          <img src="https://user-images.githubusercontent.com/106716130/199361814-8b61b346-5ec8-4a00-a5d0-7db1e3d038fd.gif" />


  <h4> Progress Tracker </h4>
  Returns all the sets performed for the chosen exercise within the given date range, grouped by session and sorted by date in descending order, such       that the most recent session is shown first. </br>
    <img src="https://user-images.githubusercontent.com/106716130/199361877-b2e64b8f-32b3-4d62-bcab-2356cb7716fd.gif" />

  </details>

<details>
  <summary>
<h3> Additional Features </h3>
    </summary>
    
  <h4> Password strength requirements </h4>
    In this example, the password lacks an uppercase letter, hence the error.
    <img src="https://user-images.githubusercontent.com/106716130/199365818-1caca15e-9b06-47a7-a25e-303cbf3be6d5.gif" />


  <h4> Toggle dark / light theme </h4>
      <img src="https://user-images.githubusercontent.com/106716130/199361961-f86e8efe-50ee-439b-91f4-7b1dfdd91141.gif" />

  <h4> Time zone support </h4>
      So that calendar events (sessions) display on the calendar at the correct time.
            <img src="https://user-images.githubusercontent.com/106716130/199361972-48c3211d-0b56-41a7-b750-20b3ffe88654.gif" />
  <h4> Deactivate account </h4>
      <img src="https://user-images.githubusercontent.com/106716130/199361960-1e55baae-a2b0-4492-b662-c5a21819228e.gif" />

  </details>
  
  <h2> Current Limitation </h2>
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
    <li> Suggested Exercises continues to pop up on Sessions page if user only hits 'SKIP' button and does not use it to add exercises.</li>
        <li> Changing a user's time zone only updates calendar event rendering, not the start / end time attributes of that Session in the database.</li>
        <li> Add session popup sometimes does not close on a successful CREATE Session.</li>
  </ul>
    
