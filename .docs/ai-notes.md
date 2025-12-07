firebase target:apply hosting admin garden-projects-admin
firebase target:apply hosting web garden-projects

firebase deploy --only hosting

website setup

I have created a new website app for the project using only React because the next.js web project just wasnt working. I have decided to simplify the website for opimum performance.
The new website will not connect to the Go backend and will not connect directly to the firebase database. Instead we will just use a json file.
I want the admin app to create a JSON file for active projects from those saved in the firebase storage. I then want to use this JSON file to display data on the website.

Before you help me with and coding can you confirm that you understand what I want to achive.

TO DO

1. Add active/disable to projects in backend functions and admin (also shared types will need updating)
2. Create a function in apps/backend to create a JSON file with the projects data from the firebase database.
3. In Admin settings add a button to run the new function that will create a JSON file with the active projects.
4. Save JSON in firebase storage "website/projects.json"
5. Create projects page in new website app
6. Create a project page to display a single project.
7. Connect Website to firebase storage and use the projects.json file to load project


The next task I would like you to do is to add some new feilds to the website settings. I have already added the data to the firebase database and I have updated the shared types settings.ts. I need you to update the backend with the new feilds in the settings.go file and then add the feilds to the WebsiteConfig.tsx so they can be edited