# DEV/GEM - Add-ons Registry Web Application

Welcome to DEV/GEM, a powerful Add-ons Registry web application that makes it easy for users to find, publish, and manage addons for their preferred IDE. Whether you're a developer looking for the right tool or you have developed your own extension you want to publish, DEV/GEM has got you covered.

**Disclaimer**: This application was made as an educational project. All content is not intended for real-world use and any transactions are in test mode. Please refrain from using the content in any other way.

## Table of Contents

- [DEV/GEM - Add-ons Registry Web Application](#devgem---add-ons-registry-web-application)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Getting Started](#getting-started)
  - [Scheme (structure) of the documents in the database](#scheme-structure-of-the-documents-in-the-database)
  - [Public Part](#public-part)
  - [Private Part](#private-part)
  - [Administrative Part](#administrative-part)
  - [Additional Features](#additional-features)
  - [License](#license)
  - [Authors and acknowledgment](#authors-and-acknowledgment)

## Introduction

DEV/GEM is designed to provide a seamless experience for users who want to explore, publish, and manage addons. It encompasses a wide range of features to ensure that both anonymous and authenticated users can make the most of the application.

## Getting Started

<span style="color:green">**View the latest deployed online version [HERE](https://unknown-adonis.web.app/).**<span>

To run DEV/GEM on your local machine, follow these steps:

1. Clone this repository: ```git clone https://github.com/your-username/addonis.git```
2. Install dependencies: ```npm install```
3. Start the development server: ```npm run preview```


## Scheme (structure) of the documents in the database

The data is stored in a document (NoSQL) database hosted by Google Firebase. The documents are organized to achieve the functionalities described in the project description.


```firebase realtime database
|
├─ users
|  ├─ username
|     ├─ blockedStatus: {bool}
|     ├─ company: {string}
|     ├─ createdOn: Date in UNIX format
|     ├─ email: {string}
|     ├─ firstName: {string}
|     ├─ lastName: {string}
|     ├─ phoneNumber: {string}
|     ├─ profilePictureURL: {string}
|     ├─ role: {string}
|     ├─ uid: {string}
|     ├─ username: {string}
|     ├─ notifications
|     |  ├─ notification
|     |  |  ├─ id: {string}
|     |  |  ├─ content: {string}
|     |  |  ├─ time: Date in UNIX format
|     ├─ role: 'user' or 'admin'
|     ├─ uid: {string}
|     ├─ username: {string}
├─ addons
|  ├─ addonID
|     ├─ addonId: {string}
|     ├─ company: {string}
|     ├─ description: {string}
|     ├─ contributors
|     |  ├─ [key]: {userUid}
|     ├─ createdOn: Date in UNIX format
|     ├─ downloadLink: {string}
|     ├─ logo: {string}
|     ├─ downloads: {number}
|     ├─ price: {number}
|     ├─ featured: {bool}
|     ├─ isFree: {bool}
|     ├─ name: {string}
|     ├─ originLink: {string}
|     ├─ ownerUid: {string}
|     ├─ rating: {string}
|     ├─ status: {string}
|     ├─ hasReview
|     |  ├─ userUid: {bool}
|     ├─ images
|     |  ├─ [key]: {string}
|     ├─ userUid: {string}
|     ├─ tags
|     |  ├─ tag: {bool}
|     ├─ versions
|     |  ├─ [key]: {string}
|     ├─ targetIDE: {string}
|
├─ adminMessages
|  ├─ messageId
|     ├─ avatar: {string}
|     ├─ content: {string}
|     ├─ id: {string}
|     ├─ time: Date in UNIX format
|     ├─ username: {string}
├─ analytics
|  ├─ addonId
|     ├─ [key]
|        ├─ downloads: {number}
|        ├─ pageVisits: {number}
|        ├─ ratingsCount: {number}
|        ├─ ratingsNum: {number}
|     ├─ addonId: {string}
|     ├─ addonName: {string}
├─ IDEs
|  ├─ IDEId
|     ├─ IDEId: {string}
|     ├─ createdOn: Date in UNIX format
|     ├─ name: {string}
├─ tags
|  ├─ tagId
|     ├─ tagId: {string}
|     ├─ createdOn: Date in UNIX format
|     ├─ name: {string}
├─ replies
|  ├─ replyId
|     ├─ addonId: {string}
|     ├─ author: {string}
|     ├─ content: {string}
|     ├─ createdOn: Date in UNIX format
|     ├─ replyId: {string}
|     ├─ reviewId: {string}
├─ reviews
|  ├─ reviewId
|     ├─ addonId: {string}
|     ├─ author: {string}
|     ├─ content: {string}
|     ├─ createdOn: Date in UNIX format
|     ├─ rating: {number}
|     ├─ replyId: {string}
|     ├─ reviewId: {string}
|     ├─ userEmail: {string}
|     ├─ userUid: {string}
├─ versions
|  ├─ versionId
|     ├─ addonId: {string}
|     ├─ createdOn: Date in UNIX format
|     ├─ downloadLink: {string}
|     ├─ info: {string}
|     ├─ userUid: {string}
|     ├─ version: {string}
|     ├─ versionId: {string}
```

## Public Part

The public part of DEV/GEM is accessible to anonymous users. Here's what you can do:

- Register and login.
- Explore featured, popular, and new addons.
- View addon details including name, description, creator, tags, downloads, rating, and more.
- Filter and sort addons based on various criteria.
- Download addons directly from the landing page.

![Home page](./assets/image.png)

![Category](./assets/image-1.png)

![Sign up](./assets/image-2.png)

## Private Part

Authenticated users have access to the private part of DEV/GEM. Here's what you can do:

- Login and logout securely.
- Update your profile information.
- Manage your addons (Create, Read, Update, Delete).
- Rate addons to share your feedback.
- Buy add-on subscriptions.

![Log in](./assets/image-3.png)

![Home view](./assets/image-4.png)

![Account settings](./assets/image-6.png)

![Analytics panel](./assets/image-7.png)

![Manage addons](./assets/image-8.png)

![My subscriptions](./assets/image-9.png)

![Detailed addon1](./assets/image-10.png)

![Detailed addon2](./assets/image-11.png)

![Versioning](./assets/image-12.png)

![Reviews](./assets/image-13.png)

![GitHub source info](./assets/image-14.png)

## Administrative Part

Admin users have additional privileges for managing the application. Here's what you can do:

- Approve new addons and make them visible to the public.
- Manage users by searching, blocking, or unblocking them.
- Edit or delete all addons.

![Admin panel](./assets/image-19.png)

## Additional Features

DEV/GEM offers optional features to enhance the user experience:

- Email Verification: Verify email to complete registration.
- Addon Creation Verification: Verify addons with unique codes.
- Identity Verification: Verify users with ID card and selfie.
- Joint Add-ons: Collaboratively manage addons.
- Recurring Metrics Reports: Receive automated reports for addons.
- Additional User Functionality: Follow other users and get notifications.
- Buy add-on subscriptions: Make purchases using card, GPay or Apple pay.
- Admin chat: Group chat available for admin users.
- Notifications: User notifications for important events.
- Rich text and images descriptions: Upload concise, visually rich add-ons.
- Manage subscriptions: View invoices or cancel subscriptions.

![Pricing](./assets/image-15.png)

![Checkout review step](./assets/image-16.png)

![Billing info step](./assets/image-17.png)

![Payment step](./assets/image-18.png)

![Verify to upload](./assets/image-5.png)

![Manage contributors](./assets/image-21.png)

![Admin chat](./assets/image-20.png)

![Notifications](./assets/image-22.png)

## License

DEV/GEM is licensed under the [MIT License](LICENSE).

## Authors and acknowledgment

[Hristiyan Fachikov](https://gitlab.com/hristiyan.fachikov)

[Maria Karamfilova](https://gitlab.com/maria_karamfilova)

[Viktor Petrov](https://gitlab.com/viktor.mp)


