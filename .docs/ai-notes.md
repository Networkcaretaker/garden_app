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


I want to add the website "logo" to the general setting component.
If there is not a logo already saved we need an option to upload an image. We can use the imageResize function to resize the image to 512x512 but we will need to update the uploadImage function (or create a new function) for uploading the website logo image to the storage location "/website/images/WebsiteLogo.webp"
we will also need to save the WebsiteImage data to the website settings in the database, this may require updating the backend but for now lets just work on the admin app.

If there is already a logo image saved, we need to display the logo with the url and storage path (not editable), but also add editable feilds for caption and alt text

here is the settings types file for reference to the WebsiteImage type:
here is the general file where we need to add the logo section (place below the description)
here are the ImageUpload and Image Resize files
and here is the ProjectCreate file just for reference on how we have add project images
If you need access to any other files please ask.

