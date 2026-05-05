# 

# 

# 

# 

# 

# 

# 

# Blueprint: Final Report 

By: Jeongha Park, Isaac Trejo Mendoza, Jacob McPherson, Obadiah Sieg

# Table of Contents

**[Introduction	1](#introduction)**

[**Technology	1**](#technology)

[Version Control in Collaboration with GitHub	1](#version-control-in-collaboration-with-github)

[On the Learning Curve and Ease of Use	1](#on-the-learning-curve-and-ease-of-use)

[Workflow Enhancement	1](#workflow-enhancement)

[Frontend Framework and Build Tools: React-Vite	1](#frontend-framework-and-build-tools:-react-vite)

[Component-Based Architecture	2](#component-based-architecture)

[Vite and HMR	2](#vite-and-hmr)

[Learning Curve	2](#learning-curve)

[Development Environment: Visual Studio Code (VSCode)	2](#development-environment:-visual-studio-code-\(vscode\))

[Extensibility	2](#extensibility)

[Integrated Terminal	2](#integrated-terminal)

[Backend and Database Management: Supabase	2](#backend-and-database-management:-supabase)

[Relational Model	2](#relational-model)

[Security and UX	3](#security-and-ux)

[Hosting and Deployment: Vercel	3](#hosting-and-deployment:-vercel)

[Ease of Deployment	3](#ease-of-deployment)

[Administrative Hurdles	3](#administrative-hurdles)

[Mockups and Prototyping with Figma	3](#mockups-and-prototyping-with-figma)

[Visual Roadmap	3](#visual-roadmap)

[Summary and Recap	3](#summary-and-recap)

[**Design	4**](#design)

[1\. Classes	4](#classes)

[Home	4](#home)

[FullCalendar	4](#fullcalendar)

[TaskList	5](#tasklist)

[ProfileSidebar	5](#profilesidebar)

[LeftSidebar	5](#leftsidebar)

[Interfaces (Quest and Project)	5](#interfaces-\(quest-and-project\))

[Supporting Components	6](#supporting-components)

[2\. Database Tables and Scripts	7](#database-tables-and-scripts)

[Users	7](#users)

[Projects	8](#useravatars)

[Quests	8](#useravatars)

[Avatars	8](#useravatars)

[ProjectMembers	8](#useravatars)

[QuestAssignments	8](#useravatars)

[XPLog	8](#useravatars)

[UserAvatars	8](#useravatars)

[3\. Server-side Scripts	9](#server-side-scripts)

[Authentication and User Onboarding	9](#authentication-and-user-onboarding)

[Gamification and XP Automation	9](#gamification-and-xp-automation)

[Security and Collaboration	9](#security-and-collaboration)

[Real-Time Synchronization	9](#real-time-synchronization)

[4\. Required Data Files	10](#required-data-files)

[5\. Others	10](#others)

[**Deployment	10**](#deployment)

[1\. Repository Setup	10](#repository-setup)

[2\. Supabase Initialization	11](#supabase-initialization)

[3\. Environment Variables	11](#environment-variables)

[4\. Local Compilation	11](#local-compilation)

[5\. Production Deployment	11](#production-deployment)

[**Known Issues	11**](#known-issues)

[1\. Tight coupling	12](#tight-coupling)

[2\. Real-Time Subscription Latency and Inconsistencies	12](#real-time-subscription-latency-and-inconsistencies)

[3\. Complex Row Level Security (RLS) Intense Edge Cases	12](#complex-row-level-security-\(rls\)-intense-edge-cases)

[4\. Incomplete Gamification Feedback Loops/Animation Stalls	12](#incomplete-gamification-feedback-loops/animation-stalls)

[5\. Limited Mobile Touch Interactions for Calendar Views	13](#limited-mobile-touch-interactions-for-calendar-views)

# 

# Introduction {#introduction}

Group projects can be hard to manage; many of the tools available today are designed for large corporations, not small groups. The purpose of this project is to provide a simple, easy-to-use project management tool for scheduling, managing, and completing a collegiate or lower-level project from start to finish. Not only is Blueprint’s UI simple and easy to use, but it also provides guidance by giving a user the current status of their project. This is done through the calendar and task list we have provided. Users can create tasks and assign a “priority” so all other users assigned to the project know what to focus on. The calendar can be used to see when every part of the project needs to be completed and figure out the best time for their group to work on them. 

# Technology {#technology}

The development of Blueprint required a diverse stack of modern technologies. Each tool was selected based on its ability to streamline the collaborative workflow or provide essential backend functionality. The following narrative details the selection criteria, the learning process, and the technical impact of these tools on the final product.  

## Version Control in Collaboration with GitHub {#version-control-in-collaboration-with-github}

GitHub, utilizing the Git version control system, served as the mandatory foundation for the project’s codebase management.

### On the Learning Curve and Ease of Use {#on-the-learning-curve-and-ease-of-use}

The team found the learning curve for GitHub and Git to be remarkably low. By mastering a small set of core commands—push, pull, and commit—group members could synchronize their work across different environments with minimal friction.  

### Workflow Enhancement {#workflow-enhancement}

GitHub’s primary advantage was its deep integration with other components of the stack, such as Vercel and Supabase. This enabled automated deployments and centralized account management, significantly increasing completion speed. The platform remained the project's stable foundation, with no architectural changes throughout the lifecycle.

## Frontend Framework and Build Tools: React-Vite {#frontend-framework-and-build-tools:-react-vite}

The team evaluated both Angular and React, ultimately choosing React-Vite for its superior speed and established ecosystem.  

### Component-Based Architecture  {#component-based-architecture}

React's core philosophy of breaking the user interface into small, reusable components saved significant development time. This was particularly evident when building complex views, such as the Dashboard and Full Calendar, where components could be repurposed to maintain a consistent UI.

### Vite and HMR {#vite-and-hmr}

The inclusion of Vite as the build tool provided "Hot Module Replacement" (HMR). This allowed developers to see code changes instantly on a local server without a full-page refresh, making the debugging process much less frustrating.  

### Learning Curve {#learning-curve}

For team members already familiar with JavaScript/TypeScript, HTML, and CSS, React was intuitive to learn, allowing the team to jump into application development quickly.

## Development Environment: Visual Studio Code (VSCode) {#development-environment:-visual-studio-code-(vscode)}

VSCode was selected as the primary Integrated Development Environment (IDE) due to its lightweight nature and extensive customizability.

### Extensibility {#extensibility}

The vast library of extensions specifically for React, Tailwind CSS, and database management allowed the team to tailor the editor to their specific tech stack.

### Integrated Terminal {#integrated-terminal}

The built-in terminal facilitated a seamless workflow, allowing team members to run Git commands and manage the Vite local server without switching between windows. Because the team had prior experience with VSCode, the learning curve was virtually nonexistent.

## Backend and Database Management: Supabase {#backend-and-database-management:-supabase}

Supabase was implemented as the primary data storage and authentication solution for this project.

### Relational Model {#relational-model}

Using a PostgreSQL backend, Supabase provided a relational model that was easy for the team to grasp because it was similar to standard SQL. The advanced dashboard UI enabled rapid modification and table updates as the database schema evolved.  

### Security and UX {#security-and-ux}

Supabase provided integrated access to Google OAuth 2.0. By allowing users to sign in with their Google accounts, the project enhanced both its security posture and the overall user experience by removing the need for custom password management.

## Hosting and Deployment: Vercel {#hosting-and-deployment:-vercel}

Vercel was chosen to host the live web application because of its native support for the React-Vite stack.

### Ease of Deployment {#ease-of-deployment}

The platform is largely self-explanatory and links directly to the GitHub repository.

### Administrative Hurdles {#administrative-hurdles}

The team encountered a significant bottleneck when the initial hosting member lacked administrative permissions on GitHub, resulting in a disconnected "clone" that did not update with new code. Once a team member with administrator access re-hosted the project, the CI/CD (Continuous Integration/Continuous Deployment) pipeline functioned flawlessly.

## Mockups and Prototyping with Figma {#mockups-and-prototyping-with-figma}

Figma was utilized during the early phases of the project to generate visual inspiration and mockups.

### Visual Roadmap {#visual-roadmap}

While not strictly necessary for the application's code to function, Figma helped the developers envision the final design, serving as a blueprint for the HTML and CSS implementation. It proved helpful at various stages of the project to ensure the team stayed aligned with the desired aesthetic.

## Summary and Recap {#summary-and-recap}

Despite the ease of use of these tools, the project stalled due to misconfigured Supabase settings and Vercel permissions issues. These experiences highlighted the need to research tool-specific limitations and peculiarities before full-scale development.

# Design {#design}

The project development team took great pains to ensure the design, both behind the scenes and the assets seen by the user, were configured in the best possible way for this project, specifically the interrelations of the datatables in Supabase. The assets seen by the user were designed to be simple and easy to use, with as little clutter as possible, given the project’s original goal. However, the following will detail the user interface itself, not only display the Entity-Relational Diagram of the tables in Supabase, but also describe it. 

1. ## Classes {#classes}

   Several classes had to be created for this project to work. To list them: Home, FullCalendar, TaskList, ProfileSidebar, LeftSidebar, two interfaces (Quest and Project),  and supporting components, such as MinimalCalendar, InviteModal, and Settings. These classes are explored further and defined for the reader below.

   ### Home {#home}

   The Home class serves as the central "brain" of the application, managing the global state and coordinating data flow between the Supabase backend and the various UI components. It is made up of the following:   
* State Management: maintains the "Source of Truth" for the application using React state hooks for quests and projects.  
* Data Synchronization: It encapsulates the fetchAllData function, which performs complex asynchronous queries to Supabase to retrieve user-specific tasks and workspace details.  
* Logic Coordination: packages all high-level handlers–such as handleCreateProject, handleAddTask, and handleStatusChange–are defined here and passed down to child components to ensure data consistency across the dashboard and calendar views.

  ### FullCalendar {#fullcalendar}

  The FullCalendar class is responsible for translating the user's timestamp into a visual, interactive weekly schedule. The following are all of the components that make it up:  
* Positioning Algorithms: uses a specific constant (HOUR\_HEIGHT) and date-math logic to calculate the exact vertical pixel position of a task based on its dueDate.  
* Temporal Navigation: manages the currentDate and selectedDate states, allowing users to move between weeks while maintaining a view of tasks relative to the current hour.

  ### TaskList {#tasklist}

  The TaskList class manages the modular rendering of individual quest items and their associated interactive states. It is made up of the following:  
* Interactive Logic: handles status switching, transitioning tasks between "Pending," "In-Progress," and "Complete," and triggering the corresponding database updates via passed-down props.  
* UI State Persistence: tracks "expanded" states for each task using a Set of IDs, allowing users to view detailed quest descriptions without losing their place in the list.

  ### ProfileSidebar {#profilesidebar}

  The ProfileSidebar functions as the gamification engine's visual interface, translating database values into user-friendly progress indicators.  
* XP Synthesis: retrieves raw experience point data from the XPLog and Quests tables and utilizes the calculateLevel utility to determine a user's level, rank, and title.  
* Dynamic Avatars: coordinates with the getActiveAvatar logic to render specific character assets based on the user's progress and chosen "lineage".

  ### LeftSidebar {#leftsidebar}

  The LeftSidebar class serves as the primary navigation hub and workspace switcher. It consists of the following:   
* Workspace Isolation: manages the activeProject state, filtering the data displayed across the entire application.  
* Team Visualization: runs secondary queries to fetch project teammates' avatars and levels, fostering a sense of collaborative progress.

  ### Interfaces (Quest and Project) {#interfaces-(quest-and-project)}

  In the absence of traditional object-oriented classes, TypeScript Interfaces were created to serve as the structural blueprints (pun intended) for the system's data.  
* The Quest Interface: This interface strictly defines the properties of a task—including questID, status, priority, and XP—ensuring that the frontend logic always adheres to the schema expected by the Supabase database.  
* The Project Interface defines the core attributes of a workspace, facilitating the "buy and forget" data organization model, where tasks are strictly partitioned by their parent project.

  ### Supporting Components {#supporting-components}

  The classes MinimalCalendar, InviteModal, and Settings were created to ensure the project's success and meet peripheral standards. They are the following:  
* MinimalCalendar: a heat-map generator that calculates task density per day using a date-string matching algorithm to assign visual "urgency" colors.  
* InviteModal: a specialized class for handling collaborative onboarding, verifying external usernames against the Profiles table before creating a new ProjectMember record.  
* Settings: an administrative interface that manages user preferences, such as updating @username handles and selecting "Avatar Lineages" for character evolution.

2. ## Database Tables and Scripts {#database-tables-and-scripts}

   Supabase is the database management tool the project used to create, alter, and manage the data the website uses. The Entity Relationship Diagram is very helpful for understanding the database's relationship structure. 

### 	Users {#users}

The User table has the primary key userID. This value is used to uniquely identify the user entries. The firstName and lastName values store the user’s first and last name. They were split for the purpose of alphabetical listing of the names. The email value stores the user's email address that we receive after the user logs in with their Google account. The total XP value is the sum of all the XP the user has accumulated across all projects they have been part of and completed tasks for. 

### 	Projects {#useravatars}

The Projects table has the primary key projectID. This value uniquely identifies each project entry. The ownerID is a foreign key that links the project to a specific user in the Users table. The projectTitle and description store the project's name and details, while creationDate and dueDate track the timeline. The status value indicates the project's current stage.

### Quests {#useravatars}

The Quests table has the primary key questID. This value uniquely identifies specific tasks within the system. The projectID foreign key links each quest to its parent project. It stores questName and questDetails to define the task, along with XP values representing the reward for completing it. The priority and status fields help categorize the quest's importance and current progress.

### Avatars {#useravatars}

The Avatars table has the primary key avatarID. This value uniquely identifies each collectible character or icon. The image value stores the reference to the visual asset, and the XPRequired value defines the minimum experience threshold a user must reach to unlock that specific avatar.

### ProjectMembers {#useravatars}

The ProjectMembers table uses a composite primary key consisting of userID and projectID, which also serve as foreign keys. This table facilitates a many-to-many relationship between users and projects. The role value defines the specific capacity in which a user is participating in that project (e.g., contributor or viewer).

### QuestAssignments {#useravatars}

The QuestAssignments table uses a composite primary key of userID and questID. This table tracks which users are actively working on specific quests. The assignedDate value records exactly when the task was assigned to the user, enabling better tracking of task duration and accountability.

### XPLog {#useravatars}

The XPLog table has the primary key logID. This value uniquely identifies each experience point transaction. The userID and questID foreign keys identify who earned the points and which task they completed to get them. The timeStamp value records the exact date and time the XP was awarded for auditing purposes.

### UserAvatars {#useravatars}

The UserAvatars table uses a composite primary key of userID and avatarID. This table tracks the avatars each user has collected. The unlockedDate value stores when the avatar was acquired, and the isActive boolean value determines which avatar is currently being displayed on the user's profile.

3. ## Server-side Scripts {#server-side-scripts}

   The server-side logic ensures data integrity, security, and automated progression within the application. They are the following: 

   ### Authentication and User Onboarding {#authentication-and-user-onboarding}

* Google OAuth 2.0 Integration: A script-level configuration that handles the secure exchange of tokens between Google and the application.  
* User Profile Initialization: Upon the first successful login, a trigger or server-side function ensures a record is created in the Users table with a default totalXP of zero.  

  ### Gamification and XP Automation {#gamification-and-xp-automation}

* Quest Completion Handler: Logic triggered when a Quest status is updated to "Complete". This script must:    
    
1. Update the completionDate in the Quests table.  
2. Insert a new record into the XPLog with a timeStamp for auditing.  
3. Increment the user’s totalXP in the Users table based on the quest’s designated XP value.    
* Avatar Unlock Logic: A server-side check that compares a user’s updated totalXP against the XPRequired values in the Avatars table. If a threshold is met, the script inserts a new entry into the UserAvatars table.  

  ### Security and Collaboration {#security-and-collaboration}

* Row Level Security (RLS) Policies: These scripts reside in Supabase to ensure that users can access or modify data only within projects where they are listed in the ProjectMembers table.  
* Project Membership State Machine: A robust logic sequence that manages role assignments (e.g., "Owner" or "Contributor") to prevent permission edge cases between team members.

  ### Real-Time Synchronization {#real-time-synchronization}

* WebSocket Broadcasting: Supabase-managed scripts that broadcast database changes (like moving a task or completing a quest) to all active clients in a project workspace.

4. ## Required Data Files {#required-data-files}

   To ensure the application functions correctly upon deployment, several configuration and asset files are required. They can be seen below.  
* .env.local: A critical environment file containing the VITE\_SUPABASE\_URL and VITE\_SUPABASE\_PUBLISHABLE\_DEFAULT\_KEY necessary for database connectivity.    
* package.json: Defines the project dependencies, including React, Vite, Supabase-js, and Lucide-React, which are installed via npm install.    
* SQL Scripts: Located in the /sql directory, these files contain the schema definitions and Row Level Security (RLS) policies required to initialize the Supabase backend.    
* index.css: Contains the Tailwind CSS directives that define the global styling and responsive design utility classes.

5. ## Others {#others}

   Additional tools and protocols were implemented to maintain project quality and team workflow. They are below.  
* Hot Module Replacement (HMR): Provided by Vite, it allows near-instant updates during development, speeding up UI iterations.    
* Lucide-React: A consistent iconography library used to provide visual cues for actions such as "Add Task," "Delete," and "Settings."  
* Optimistic UI Updates: A strategy used to mitigate Real-Time Subscription Latency, where the interface updates immediately upon user action before the server confirms the change.    
* Pre-Deployment Demo: The development team’s protocol of testing all builds on a localhost:5173 server before pushing to the production environment on Vercel.

# Deployment {#deployment}

To deploy this project, follow the steps listed below. They will require the user to understand GitHub, Git commands and functions, Node.js, Supabase, SQL code and functions, ERDs, Windows or macOS directories, URLs, API keys, Vercel, and hosting. Should the user not understand any of these facets in depth (emphasis on in depth), the user should investigate each of them in depth to ensure that they not only understand what they are working with but also how to work with it, so that they can successfully deploy this project. Again, please follow each step closely to successfully deploy the website. 

1. ## Repository Setup  {#repository-setup}

   Clone the repository from GitHub using git clone \[repository\_url\]. Navigate into the project directory and run npm install to install all necessary Node modules and dependencies.	

2. ## Supabase Initialization  {#supabase-initialization}

   Create a new project in the Supabase dashboard. Execute the SQL scripts in the /sql folder in the SQL Editor to create the necessary users, projects, and quest tables, and to apply the Row Level Security policies. 

3. ## Environment Variables {#environment-variables}

   To correctly implement the environment variables, the user should create a .env.local file in the root directory of the folder containing their cloned repository. In order to do this, the user must supply the following API keys from their Supabase project settings:  
* VITE\_SUPABASE\_URL  
* VITE\_SUPABASE\_PUBLISHABLE\_DEFAULT\_KEY

		

4. ## Local Compilation  {#local-compilation}

   To run this project locally, open a new Bash terminal. After the terminal is open, run this command \- “npm run dev”. This will launch the application running on localhost. Since Vite was used for this project, the port that it opens on is 5173\. So, go to http://localhost:5173 in any browser, and the application will be running and interactable.

5. ## Production Deployment  {#production-deployment}

   Finally, to deploy this project, push the local main branch to GitHub. Then log in to Vercel, import the GitHub repository, and add the Supabase environment variables to the Vercel deployment settings. Fortunately, Vercel will automatically compile the build and provision an SSL-secured URL. Once the user has done this, Vercel will automatically redeploy any changes made to GitHub, given they are formatted correctly and deployable with the current version of the code. The dev team recommends that all users demo their changes, updates, and new builds on a local host server first to ensure that the changes (a) function correctly and (b) work with the current version of the code. Then, they may push them to GitHub, hoping that everything has gone well and according to plan, and that Vercel will automatically redeploy the website. The user should again check these to ensure everything is still working correctly. Then, the user will have (in theory) a fully functional website that can work with anyone, wherever they are, given the current status of the website. Again, any changes made will be added to this document to reflect their impact on the website and what the user should expect to get it working correctly. 

# Known Issues {#known-issues}

The following section outlines technical debt, architectural bottlenecks, and incomplete functionalities identified by the development team. Each entry includes a description of the problem and the strategic approach planned for future iterations.  

1. ## Tight coupling  {#tight-coupling}

   As the application grew, the lead architect identified that the current codebase is quite tightly coupled. Currently, many important functions and database handlers are tightly coupled with the component classes. This causes different responsibilities to be somewhat jumbled together, making the code harder to read, maintain, and test over time. To resolve this issue and strictly adhere to the architectural design principle of separation of concerns, the development team plans to implement a dedicated service layer. Extracting all core logic and handlers into this service layer will allow the frontend classes to focus solely on rendering the user interface, resulting in a much cleaner, more professional architecture.

2. ## Real-Time Subscription Latency and Inconsistencies {#real-time-subscription-latency-and-inconsistencies}

   While Supabase provides real-time WebSocket subscriptions for database changes—such as when a teammate modifies a task on the dashboard—there is an observable delay in broadcasting these updates to all connected clients. This latency can lead to "race conditions" where two users attempt to update the same quest simultaneously.    
   The team is currently implementing an Optimistic UI Update strategy. By updating the local state in Home.tsx immediately upon a user’s action, the application maintains a fluid feel regardless of network speed. In future versions, the team plans to integrate React Query or a similar caching layer to handle state revalidation and automatic rollbacks if the server-side update fails.  

3. ## Complex Row Level Security (RLS) Intense Edge Cases {#complex-row-level-security-(rls)-intense-edge-cases}

   The current implementation of RLS policies occasionally restricts user access during rapid project transitions. For instance, if an owner transfers a project to a member, the permission cache in Supabase may not be invalidated immediately, leading to temporary 403 Forbidden errors for the new owner.    
   The development team has begun refactoring the ProjectMembers junction table to use a Robust State-Machine Logic for role assignments. This involves moving permission checks into dedicated PostgreSQL functions that can be invoked with higher security clearance to override stale cached policies.  

4. ## Incomplete Gamification Feedback Loops/Animation Stalls {#incomplete-gamification-feedback-loops/animation-stalls}

   While the XPLog and calculateLevel logic correctly process experience points, the visual feedback—specifically the XP progress bar in ProfileSidebar.tsx—sometimes fails to animate smoothly when multiple quests are completed in rapid succession.    
   The planned fix involves decoupling the progress bar's visual state from the global totalXP state. By using a local spring-based animation library (such as Framer Motion), the UI can queue animations, ensuring each XP gain is visually represented even when the underlying data updates are batched.

5. ## Limited Mobile Touch Interactions for Calendar Views {#limited-mobile-touch-interactions-for-calendar-views}

   The FullCalendar.tsx component, while functional on desktop, has limited "drag-and-drop" support for touch devices. Users on mobile devices currently struggle to reorder timed tasks due to the high density of the CSS grid layout.    
   The team intends to implement a specialized Mobile View Toggle within FullCalendar. This will replace the vertical time grid with a chronological "Agenda View" similar to the TaskList, but specifically for scheduled items. This approach sidesteps the physical limitations of touch-based dragging in tight vertical spaces while maintaining the project's "one quest at a time" philosophy.

