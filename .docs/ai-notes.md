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





I want to update the image section on the ProjectEdit.tsx page
The first thing we need to do is add image groups. The default group will be called Featured Images and will be of type Gallery.
We will need a container for the group on the page with the images saved indside
We will remove the "image"feild from the projects later after we have successfully created the grouping functionality.
under the featured group we need an option to create a new group. The new group will require a name, type and an option to upload images into the group.
Images will be saved in storage in the same way as before but the image data will now be saved in the image section of the image group. I hope this makes sence.
Also, after an image group has been saved (inluding default Featured Images group) the name and type cannot be changed.
We will need an option to be able to delete a group but not the Featured Images Group as this is defualt. Before a group can be deleted, the images inside the group must be deleted or moved to another group first. We will sort out moving images between groups later on.
Does this make sence?




