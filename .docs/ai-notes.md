Say this to gemini before every prompt.

DO NOT MAKE ANY ASSUMPTIONS
DO NOT OVERCOMPLICATE THE TASK


Next Tasks
1. Delete projects (including project images) in admin and backend **DONE**
2. Header with navigation on website project and projects pages **DONE**
3. Project settings page (taxonomies) with editible Catagories and Tags (include remove function) **DONE**
4. Create pop up on create and edit projects page to add new category or tag **DONE**
5. Add testimonials to homepage **DONE**
6. Create website footer with contact and social links
7. Add Groups to images and group type (collection, slider) **DONE**
    - Groups should have editable title and description fields **DONE**
    - Collection groups will have an option for small or large image layouts
    - Slider groups can only have 2 images in group **DONE**
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



- Save Project - After saving a project on the ProjectEdit page the ProjectList page loads. I would prefer if the ProjectEdit reloads after saving. **DONE**

- Dont allow delete project while Active. Show warning that says "Cannot delete this project. This project is Active on website, please deactivate the project and update the website before you delete the project"


I have decided to add an "id" field to the ImageGroup interface in the project types.
I have added this field because I want to be able to select and add an image group to a Testimonial on the ProjectEdit page.
I have added an imageType feild in the Testimonial Interface and also an imageGallery feild to save an id if the imageType is gallery.

I have added two select feilds in the ProjectEdit testimonial section as placeholders. If "featured" is selected in Testimonial Image, the Image Gallery field whould be hidden. This fild will be accesable if the option "gallery" is selected. In the Image gallery feild we will select a single group from a list of saved image groups in the project.

File you will need to acesss
projects.go
projects.go
projects.ts
ProjectEdit.tsx

first I need you to add the new feilds to the backend go project. you may need to update the handler file and model file
make sure you fully understand the project and dont overcomplicate the task, dont make assumtions if you need more information please ask.
After you have updated the backend we can then update the ProjectEdit page to use the new fields.
