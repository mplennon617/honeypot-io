## MVP: The Honeypot

- Driver: Some existing redirector app (e.g. RedirectWeb)
- Honeypot location: `<base-url>/honeypot?from=http://blocked-site.com` (Avoid custom domain for now; just use default vercel domain)
- When the user visits the honeypot, create a `VisitEvent` record and store it into the database:
    - The uuid (Let’s use the uuid for “USER1” until we figure out Auth)
    - From (the site found in the ‘from’ query parameter)
    - The visited timestamp
- Honeypot frontend design:
    - Color palette options:
        1. Vintage - https://coolors.co/palette/2d728f-3b8ea5-f5ee9e-f49e4c-ab3428
        2. Modern - https://coolors.co/palette/31393c-2176ff-33a1fd-fdca40-f79824
        3. Bold - https://coolors.co/palette/072ac8-1e96fc-a2d6f9-fcf300-ffc600
    - Honeypot graphic (For now leave a placeholder honeypot image or emoji; this will be filled in with an image later)
    - A rotating text field. Possibilities: “Catch yourself before you wreck yourself.” “You’re getting the hang of this.” “Slowly changing habits, one honeypot visit at a time.” “A honeypot visit is one less visit to the site you want to avoid.” “Take a deep breath. This is how habits change.” “Keep going, my friend.” + similar.
        - Fade in animation on page visit.
        - The goal is to encourage more visits when starting to use the app. Keep it supportive.
    - Below the honeypot graphic: A “View My Data” button which navigates to `<base-url>/dashboard` (to be filled in later)
    - A toggle at the top right of the page which allows the user to view the number of times they visited the honeypot today. For now assume `USER1` is logged in.
- Backend tables to create
    - `VISITEVENT` table — see above
    - `USER` table — minimal number of columns to identify a user. For only the only required fields will be username and uuid; all other fields are nullable for now (including password until Auth integration is completed)
        - For now, hardcode one USER record with a username of “USER1” … this is the user we assume is logged in until we complete Auth/user creation features

## Stack

- Setup Stack:
    - Frontend: Next.js
    - Backend: Supabase (Postgres)
    - Deployment Stack: Vercel