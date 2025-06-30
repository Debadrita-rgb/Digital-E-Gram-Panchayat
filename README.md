# Gram Panchayat Digital Service Portal
Digitizing Rural Governance

📌 Introduction
This is a modern, user-friendly web application built to streamline and digitize services offered by the Gram Panchayat. It is a fully responsive system designed for all screen sizes and supports:

Multiple roles (Admin, Officer, Staff, User)

Real-time notifications

Multilingual interface

Form-based service submissions

Feedback and gallery modules

🎯 Objective
The primary goals of this system are:

✅ Modernize village administration

✅ Increase transparency and efficiency

✅ Digitally empower rural citizens

⚙️ Key Features
Resident Profile Management

Document Upload & ID Verification

Online Grievance Registration

Certificate Requests & Approvals

Gallery and Feedback System

Notification System

Captcha-Protected Contact & Feedback Forms

🧩 System Architecture
Frontend: React.js with TailwindCSS

Backend: Node.js & Express

Database: MongoDB with Mongoose

Authentication: JWT-based with OTP verification

👥 User Roles
👑 Admin (Panchayat Officers)

👨‍💼 Officers (Block Level)

👷 Staff

👤 Residents (Users)

🔧 Admin Functionalities
📁 Category Management
Add, edit, delete service categories (e.g., Birth Certificate, Land Records)

Toggle categories active/inactive

📝 Form Management
Add/edit/delete dynamic forms under categories

Ensure structured service forms

🧾 Service Management
Add/edit/delete services with name, image, category, description

Toggle status (active/inactive)

📂 View Categorized Services
Services displayed by category for easy tracking

See active/inactive services and application counts

📄 Application Oversight
View and filter all user applications

Accept/reject/modify application statuses

👤 User Management
Add/edit/delete staff and officers

Toggle activation status

🖼️ Gallery Management
Upload/edit/delete images under gallery titles

Useful for documenting events like "Swachh Bharat Drive"

🤝 Partner Image Management
Upload logos of partner agencies

Link partner images to websites

📬 Contact & Feedback Review
View and prioritize user-submitted contact forms and feedback

🛂 Officer Functionalities
Add and update services

Modify service availability

Accept/reject applications

Maintain activity logs

👨‍🔧 Staff Functionalities
View assigned applications

Update application statuses (Accepted, Rejected, Pending)

View and respond to user messages

💡 User Functionalities
📌 Home Banner Slider
Shows government announcements or event banners

📚 Browse & Apply for Services
View services grouped by categories

Fill out dynamic application forms

Track real-time status

🔐 Secure Registration
Name, Phone Number, Password with strong-password policy

📲 OTP Verification
Users must enter OTP before login for enhanced security

🧾 Application Flow
Submit digital applications

Track their own submission status

❌ Rejection Reasons
If rejected, users can view reasons in modal popup

👤 Profile Update
Manage personal data, gender, DOB, address

Upload multiple ID proofs with preview

Dynamic "+" and "–" ID fields

Submit triggers a success toast

📨 Contact Form
Fields: Name, Email, Message

Stored securely and reviewed by admin

💬 Feedback with Captcha
Protects against spam

Stores genuine user opinions

📄 Static Pages
About Us, Privacy Policy, Help

🖼️ Gallery Modal Viewer
Modal-based lightbox viewer

View categorized image sets under campaigns

📚 Service Categorization
Clean, card-based display of services grouped by category

🔔 Notification System
Real-time updates on status changes

See who made the update and when

Notifications stored in panel

🛎️ Animated Bell
Notification bell shakes on new message

Opens panel on click

Mark notifications as read

🔁 Service Request Flow
User submits application

Staff reviews and updates status

User tracks status

🖥️ Backend Tech Stack
MongoDB Models: Users, Applications, Services, Categories, Gallery, Feedback, Partners, Notifications, Contact

Node.js + Express

JWT Auth + OTP

Multer for image upload

💻 Frontend Stack & Dependencies
React.js + TailwindCSS

react-router-dom for routing

tiptap for rich text forms

swiper and slick-carousel for sliders

axios for API communication

react-toastify for alerts

flowbite, heroicons for UI

🔐 Security Features
JWT Authentication

Role-based UI access

Input validation on all forms

🎨 UI/UX Design
Fully mobile responsive

Dark/Light mode toggle

Clean navigation and layout

🌓 Dark/Light Mode
Available across all pages

Remembers user preference

🔮 Future Enhancements
SMS Alerts

Interactive house-level village maps

🏁 Conclusion
The Gram Panchayat Digital Portal revolutionizes local governance with:

✅ Modern UI/UX

✅ Full digitization of services

✅ Role-based control & access

✅ Transparent workflows

✅ Multilingual and mobile-ready design

🔗 Explore More
💻 Live Demo: (https://github.com/Debadrita-rgb/Digital-E-Gram-Panchayat)

🗂️ Source Code: GitHub Repo

🙏 Thank You
Empowering Villages with Digital Access
Your feedback is welcome! 🌿
