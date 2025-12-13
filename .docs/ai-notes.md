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
3. Project settings page (taxonomies) with editible Catagories and Tags (include remove function)
4. Create pop up on create and edit projects page to add new category or tag
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
11. Create Preview page for projects in Admin, Use same layout as website Project page 
    - Website Project page will have Header and Footer
    - Admin ProjectPreview Page will have options to edit project and edit images **DONE**
    - Add edit image page
12. Create EditImage page to admin to edit image metadata
13. Add About, Services and Why US to website **DONE**
14. Add social links to website
15. Add contact details to website
16. Accordian setting on mobile **DONE**
17. Add contact details to website Config

