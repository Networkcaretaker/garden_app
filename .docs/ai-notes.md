firebase target:apply hosting admin garden-projects-admin
firebase target:apply hosting web garden-projects

## Deploy Websites
firebase deploy --only hosting
firebase deploy --only hosting:website
firebase deploy --only hosting:admin

## Deploy Backend
gcloud builds submit --tag gcr.io/garden-projects/backend
gcloud run deploy garden-api --image gcr.io/garden-projects/backend --platform managed --region europe-west1 --allow-unauthenticated

Next Tasks
1. Delete projects (including project images) in admin and backend **DONE**
2. Header with navigation on website project and projects pages
3. Project settings page (taxonomies) with editible Catagories and Tags (include remove function) **DONE**
4. Create pop up on create and edit projects page to add new category or tag **DONE**
5. Add testimonials to homepage **DONE**
6. Create website footer with contact and social links
7. Add Groups to images and group type (collection, slider)
    - Groups should have editable title and description fields
    - Collection groups will have an option for small or large image layouts
    - Slider groups can only have 2 images in group
    - Slider groups have two editable label fields (Before / After)
7. Add image reordering inside groups
8. Add option to set feature image for projects
9. Add image split before and after **DONE**
10. Sort image size and rotation. Add thumbnail images
11. Create Preview page for projects in Admin, Use same layout as website Project page **DONE**
    - Admin ProjectPreview Page will have options to edit project and edit images **DONE**
12. Create EditImage page to admin to edit image metadata
13. Add About, Services and Why US to website **DONE**
14. Add social links to website
15. Add contact details to website
16. Accordian setting on mobile **DONE**
17. Add contact details to website Config


Hi Gemini, I would like to add 2 Timestamp fields to the WebsiteSettings.
The first field we need is called publishedAt wich will record the timestamp when the website is last published.
The second field we need is called projectUpdatedAt. The timestamp in this feild will be updated when an Active Project is edited and saved in the admin app.
These values will be used later in the admin project to indicate if the website needs to be updated.
We will place a section on the admin Dashboard page that states if the website is up-to-date or needs to be updated because changes have been made. Remember that we only need to update if changes are made to Active projects

Here are some of the Backend files you may need to update:
project.go
settings.go
Here are some files from the admin app:
WebsiteConfig.tsx - this is where the website is published, we will need to add the puplishedAt and projectUpdatedAt fields to this page. Can we add a new section below the Social Media called "Publish Status" and include the new feilds here. We could also move the Publish Data button into this section.
DashboardPage.tsx
And here is the shared Types file for settings
settings.ts

If there are any other files you need to access please ask.
