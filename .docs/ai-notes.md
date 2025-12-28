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


I want to update the testimonials in website setting json. We will make the changes in a few steps to make sure everything works as i want.

Here is an example of the testimonials section in the website config json file.

"testimonials": {
      "clients": [
        {
          "imageType": "slider",
          "images": [],
          "name": "Jonh Dow",
          "occupation": "Mallorca Resident",
          "text": "What a fantastic team. Our new lawns are bright and vibrant throughout the year. thank you Mallorca Gardens"
        }
      ],
      "projects": [
        "KmoAclgKom2BJcyZdmpO"
      ],
      "text": "Here is what our clients have to say",
      "title": "Client Testimonials"
    }

Task 1. add project data to testimonial.

When the website setting json file is created I would like a function to lookup the projects that are saved in the projects array and add some project data to the projects object. I would like the projects to look like this in the json file.

"testimonials": {
      "clients": [
        {
          "imageType": "slider",
          "images": [],
          "name": "Jonh Dow",
          "occupation": "Mallorca Resident",
          "text": "What a fantastic team. Our new lawns are bright and vibrant throughout the year. thank you Mallorca Gardens"
        }
      ],
      "projects": [
        {
            "id": "KmoAclgKom2BJcyZdmpO",
            "coverImage": "https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/project-images%2FKmoAclgKom2BJcyZdmpO%2F1764672197279-dfx3mor.webp?alt=media\u0026token=48250739-55a0-4e13-ae9d-5c58154d62c9",
            "testimonial": {
                "image": "gallery",
                "imageGroup": "4cbdb7b1-ca7a-49e3-9ed5-68b39d30fb42",
                "name": "John Dow",
                "occupation": "Mallorca resident",
                "text": "A great job, my garden is completly transformed. Thank you Mallorca Gardens."
            }
        }
      ],
      "text": "Here is what our clients have to say",
      "title": "Client Testimonials"
    }

Task 2. Add testimonial data to projects
In this task I now want to take the imageGroup ID's in the project testimonial and add the image data like so:

"testimonials": {
      "clients": [
        {
          "imageType": "slider",
          "images": [],
          "name": "Jonh Dow",
          "occupation": "Mallorca Resident",
          "text": "What a fantastic team. Our new lawns are bright and vibrant throughout the year. thank you Mallorca Gardens"
        }
      ],
      "projects": [
        {
            "id": "KmoAclgKom2BJcyZdmpO"
            "testimonial": {
                "image": "gallery",
                "imageGroup": {
                    "id": "4cbdb7b1-ca7a-49e3-9ed5-68b39d30fb42",
                    "type": "gallery",
                    "images": [
                        {
                            "alt": "Reform Before",
                            "caption": "Reform Project",
                            "id": "1764672200679-prwioxc37",
                            "url": "https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/project-images%2FKmoAclgKom2BJcyZdmpO%2F1764672199395-273gl6t.webp?alt=media\u0026token=8cbae3a8-e231-47bb-8d88-f7f81a689c48"
                        },
                        {
                            "alt": "Reform After",
                            "caption": "Reform Project",
                            "id": "1764672199142-8b2psm86u",
                            "url": "https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/project-images%2FKmoAclgKom2BJcyZdmpO%2F1764672197279-dfx3mor.webp?alt=media\u0026token=48250739-55a0-4e13-ae9d-5c58154d62c9"
                        }
                    ]
                },
                "name": "John Dow",
                "occupation": "Mallorca resident",
                "text": "A great job, my garden is completly transformed. Thank you Mallorca Gardens."
            }
        }
      ],
      "text": "Here is what our clients have to say",
      "title": "Client Testimonials"
    }

Task 3. Update frontend website to add the testimonials to the homepage.