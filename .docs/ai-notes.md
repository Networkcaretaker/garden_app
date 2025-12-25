firebase target:apply hosting admin garden-projects-admin
firebase target:apply hosting web garden-projects

## Local Backend
go run cmd/server/main.go  

## Deploy Websites
firebase deploy --only hosting
firebase deploy --only hosting:website
firebase deploy --only hosting:admin

## Deploy Backend
firebase use default
gcloud config set project garden-projects
gcloud builds submit --tag gcr.io/garden-projects/backend
gcloud run deploy garden-api --image gcr.io/garden-projects/backend --platform managed --region europe-west1 --allow-unauthenticated

## Client deploy
firebase use client
gcloud config set project aj-gardens
gcloud builds submit --tag gcr.io/aj-gardens/backend
gcloud run deploy garden-api --image gcr.io/aj-gardens/go-backend --platform managed --region europe-west1 --allow-unauthenticated

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


I would like to improve the PublishWebsiteData function in the backend @settings.go
You can see an example of the projects json file that gets created here: @projects.json

What I want to do is to pre-prepare some of the project data when we create the project json

In the "imageGroups" section we have an array of image ids. in the function before the json file is saved I would like to replace the image ids with a map array of the image details "id", "url", "caption" and "alt"

Here is an example from the project json using the current setup: You can see we use image ids in the imageGroups section. 

"images": [
      {
        "id": "1764672199142-8b2psm86u",
        "url": "https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/project-images%2FKmoAclgKom2BJcyZdmpO%2F1764672197279-dfx3mor.webp?alt=media\u0026token=48250739-55a0-4e13-ae9d-5c58154d62c9",
        "storagePath": "project-images/KmoAclgKom2BJcyZdmpO/1764672197279-dfx3mor.webp",
        "caption": "Reform Project",
        "alt": "Reform After"
      },
      {
        "id": "1764672200679-prwioxc37",
        "url": "https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/project-images%2FKmoAclgKom2BJcyZdmpO%2F1764672199395-273gl6t.webp?alt=media\u0026token=8cbae3a8-e231-47bb-8d88-f7f81a689c48",
        "storagePath": "project-images/KmoAclgKom2BJcyZdmpO/1764672199395-273gl6t.webp",
        "caption": "Reform Project",
        "alt": "Reform Before"
      }
    ],
    "imageGroups": [
      {
        "name": "Featured",
        "description": "Project feature images",
        "type": "gallery",
        "images": [
          "1764672199142-8b2psm86u",
          "1764672200679-prwioxc37"
        ]
      }

Here is an example of how I would like the json file to look like:

"images": [
      {
        "id": "1764672199142-8b2psm86u",
        "url": "https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/project-images%2FKmoAclgKom2BJcyZdmpO%2F1764672197279-dfx3mor.webp?alt=media\u0026token=48250739-55a0-4e13-ae9d-5c58154d62c9",
        "storagePath": "project-images/KmoAclgKom2BJcyZdmpO/1764672197279-dfx3mor.webp",
        "caption": "Reform Project",
        "alt": "Reform After"
      },
      {
        "id": "1764672200679-prwioxc37",
        "url": "https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/project-images%2FKmoAclgKom2BJcyZdmpO%2F1764672199395-273gl6t.webp?alt=media\u0026token=8cbae3a8-e231-47bb-8d88-f7f81a689c48",
        "storagePath": "project-images/KmoAclgKom2BJcyZdmpO/1764672199395-273gl6t.webp",
        "caption": "Reform Project",
        "alt": "Reform Before"
      }
    ],
    "imageGroups": [
      {
        "name": "Featured",
        "description": "Project feature images",
        "type": "gallery",
        "images": [
          {
                "id": "1764672199142-8b2psm86u",
                "url": "https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/project-images%2FKmoAclgKom2BJcyZdmpO%2F1764672197279-dfx3mor.webp?alt=media\u0026token=48250739-55a0-4e13-ae9d-5c58154d62c9",
                "caption": "Reform Project",
                "alt": "Reform After"
            },
            {
                "id": "1764672200679-prwioxc37",
                "url": "https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/project-images%2FKmoAclgKom2BJcyZdmpO%2F1764672199395-273gl6t.webp?alt=media\u0026token=8cbae3a8-e231-47bb-8d88-f7f81a689c48",
                "caption": "Reform Project",
                "alt": "Reform Before"
            }
        ]
      }


Please note, I do not want to change the images field in the database this is just for the created projects.json file.
