# 

# 

# 

# 

# 

# 

# Blueprint: Requirements Specification

By: Jeongha Park, Jacob McPherson, Isaac Trejo Mendoza, Obadiah Sieg

# Table of Contents

# [**Project Name	3**](#project-name)

# [**Team Members’ Names	3**](#team-members’-names)

# [**Abstract	3**](#abstract)

# [**Tools and Technologies	3**](#tools-and-technologies)

# [**Requirements List	4**](#requirements-list)

## [1\. (Onboarding) Login Page	4](#1.-\(onboarding\)-login-page)

## [2\. (Dashboard) Homepage & Navigation	4](#2.-\(dashboard\)-homepage-&-navigation)

## [3\. (Dashboard) Task List Component	4](#3.-\(dashboard\)-task-list-component)

## [4\. (Dashboard) Calendar Component	5](#4.-\(dashboard\)-calendar-component)

## [5\. (General) Alarm & Notification System	5](#5.-\(general\)-alarm-&-notification-system)

## [6\. (Setup) Roles & Permissions	5](#6.-\(setup\)-roles-&-permissions)

# [**Tentative Schedule	6**](#tentative-schedule)

# Project Name {#project-name}

	 Blueprint: a design plan or other technical drawing. Just as an engineer creates a blueprint for a building, the web app Blueprint provides a framework for users to build their project.  
	

# Team Members’ Names  {#team-members’-names}

* Obadiah Sieg   
* Jacob McPherson   
* Jeongha Park   
* Isaac Trejo Mendoza

# Abstract {#abstract}

	Group projects are hard to manage. Blueprint solves that. With Blueprint, users can manage everyone involved in the project through a clean, easy-to-use calendar that compares everyone’s schedules and finds the best date for them to meet up. Similarly, it allows users to list all the tasks required to create their project and assign a deadline to them. An alarm can also be set to remind them of this. Blueprint will also have a bar showing the project's completion rate, so that whenever a group member finishes a task, they can report it in the web application by selecting “Finished”, and the completion rate of the overall project will be updated to reflect it. And if time permits, Blueprint will display inspirational animations to motivate users every time they complete their work. At its core, Blueprint will have a simple, intuitive user interface that makes group projects easier for students like us. It won’t be overcomplicated or hard to look at, like most modern project management tools.

# Tools and Technologies {#tools-and-technologies}

* React for the frontend   
* Supabase for the backend  
* Vercel for the backend  
* Figma for inspiration and web design 

# Requirements List {#requirements-list}

## 1\. (Onboarding) Login Page {#1.-(onboarding)-login-page}

1.1.1 The sign-in page will have a single component for Google Authentication using Google’s OAuth 2.0  
1.2.1 This component will feature the Blueprint logo and application name  
1.3.1 A "Sign in with Google" button will be displayed  
1.3.1: The button will use a Google-approved branding  
1.3.2: Upon pressing, the button triggers Google OAuth authentication via Supabase  
1.3.3: On a successful authentication, the user will be moved to the Dashboard/Homepage via a short loading screen, if necessary  
1.3.4: On a failure, a dialog box will say, "Sign-in failed. Please try again."

## 2\. (Dashboard) Homepage & Navigation {#2.-(dashboard)-homepage-&-navigation}

2.1.1 A navigation sidebar or header to provide links to Dashboard, Calendar, Task List, and Setup/Settings  
2.2.1 A "Project Deadline" countdown at the top of the dashboard  
2.3.1 A "Completion Percentage" progress bar to reflect the ratio of completed tasks to total tasks  
2.4.1 A section for "Third-Party Links" will include icons for GitHub, Facebook, and X (formerly Twitter)

## 3\. (Dashboard) Task List Component {#3.-(dashboard)-task-list-component}

3.1.1 The Task List will display all active tasks in a vertical list view  
3.2.1 Each task block will contain:  
3.2.1 Task Name  
3.2.2 Assigned Member (showing user avatar or name)  
3.2.3 Deadline (date and time)  
3.2.4 Priority Level (color-coded: red for High, orange for medium, white for low, and green for complete)  
3.2.5 Tasks will be automatically marked as low (white)  
3.3.1 Users can toggle a task as "Finished," which triggers a completion animation and updates the project progress bar  
3.4.1 A "Past Tasks" view will show completed items sorted from most to least recent

## 4\. (Dashboard) Calendar Component {#4.-(dashboard)-calendar-component}

4.1.1 The calendar will show a monthly grid view  
4.2.1 There will be a selection for all twelve months above the month selected.   
	4.2.1 The current month will be shown automatically  
4.3.1 Task due dates will be marked with colored indicators, such as:  
4.3.1 White (Low Priority)  
4.3.2 Orange (Medium Priority)  
4.3.3 Red (High Priority)  
4.3.4 Green (Complete)  
4.4.1 Clicking a date will open a list of all the tasks due on that day in particular  
4.5.1 Tasks will automatically be “Unassigned” until the user assigns a date

## 5\. (General) Alarm & Notification System {#5.-(general)-alarm-&-notification-system}

5.1.1 Users will receive a browser notification (Toast Box) when a task is "Due Soon" (e.g., 24 hours before the deadline)  
5.2.1 An audible alert will trigger at the exact time of a task deadline

## 6\. (Setup) Roles & Permissions {#6.-(setup)-roles-&-permissions}

6.1.1 Users can be assigned specific roles within a project:  
6.1.1 Manager: Full Create, Read, Update, and Delete (CRUD) permissions for all tasks and members  
6.1.2 Team Member: Can update their own assigned tasks and view the project’s status

# 

# Tentative Schedule {#tentative-schedule}

| Timeframe | Milestone/Task |
| :---- | :---- |
| Week 1: Feb 9-15 | All members: Finalize the requirements document, initialize the GitHub repository, and set up the Supabase and Vercel hosting.  |
| Week 2: Feb 16-22 | Obadiah and Jeongha:  Start the front-end with React and create a starter web design with Figma.  Jacob and Isaac: Configure Supabase authentication and begin writing the database schema. |
| Week 3: Feb 23-Mar 1 | All members:  Implement the Google OAuth Login and begin laying out the dashboard and sidebar for the following page. |
| Week 4: Mar 2-8 | Obadiah:  Create the Task List logic using a CRUD framework.  Jeongha:  Create the Calendar UI components.  Jacob and Isaac:  Implement the hooks for the database to support real-time task updates.  |
| Week 5: Mar 9-15 | All members:  Implement the Task List and Calendar into the website and begin making the logic for the “Completion Percentage” bar. |
| Week 6: Mar 16-22 | Isaac:  Create and implement the website's alarm/notification system.  Jacob:  Create and implement a role-based access control system.  Obadiah and Jeongha:  Test for bugs and perfect CSS stylings.  |
| Week 7: Mar 23-29 | All members:  Conduct an overall assessment of the website, ensuring everything functions as intended; bug fix and polish the UI, if necessary; and create and implement the “Past Tasks” archive view. |
| Weeks 8-12: March 30-May 4 | All members:  Create and implement gamification animations and sound effects if time permits, and look into implementing an API call to ChatGPT for suggestions.  |

