# ✅ Tech Spec

# **English Center Web / App – Functional Specification**

# **Phase 1**

## **System Overview**

The platform has **3 main roles**:

1. **Admin**  
2. **Teacher**  
3. **Student**

## 

## **1️⃣ Admin Panel**

**Admin**

* Full system access
* Finance management (payment rules, salary rules, deductions %)
* System rules configuration
* Monitor teachers
* Check analytics
* Manage students & groups
* All CRUD operations

### **Admin's Core Sections**

1. Dashboard  
2. Chat  
3. Settings / Profile  
4. Teachers  
5. Students  
6. Finance  
7. Analytics  
8. Reports  
9. Graphics \>\> appointments  
10. Absence / attendees \>\> attendance registry

1. ### **Dashboard**

Admin dashboard should show:

* Total teachers  
* Total students  
* Active groups  
* Total lessons completed  
* Today’s lessons  
* Total income (daily / weekly / monthly)  
* Alerts & notifications (red flags)

### 

2. ### **Chat**

* Admin can:  
  * See **all group chats**  
  * See **teacher ↔ student chats**  
  * Receive **system notifications**  
* Special **control indicators** (explained below)

3. ### **Settings/profile**

* Personal info: name, surname, phone, email  
* Change password

4. ### **Teacher Management**

Admin can:

* Add / edit / deactivate teachers  
* Assign teachers to groups  
* See:  
  * How many lessons teacher has conducted  
  * How many students  
  * Salary calculation  
  * Missed obligations (feedback, voice message, etc.)

📌 **Important rule**  
After **each lesson**, teacher MUST:

* Leave **feedback for each student**

❗ If feedback is **not submitted**:

* System sends **automatic warning email/message** to the teacher  
* Repeated violations → shown in Admin Analytics

5. ### **Student Management**

Admin can:

* View full student database  
* See:  
  * Attendance  
  * Absences  
  * Payments  
  * Performance analytics  
* Filter by:  
  * Group  
  * Teacher  
  * Level  
  * Payment status  
  * Absence/attendance quantity

### 

6. ### **Finance**

Finance logic is **lesson-based**, not fixed salary.

📌 **Payment rules**

* Teacher gets paid **only for lessons actually conducted**  
* If teacher is absent → **no payment**  
* If replacement teacher conducts lesson → **replacement gets paid**  
* Salary updates **automatically after each lesson**

Admin can see:

* Payments per lesson  
* Payments per teacher  
* Daily / monthly total income  
* Outstanding balances

But if the teacher doesn't send the vocabulary (բառապաշար) voice message, they don't get the full lesson's cost. 

After each lesson:

* Teacher MUST send **voice or text message** in **group chat**  
* Topic: **daily vocabulary / lesson summary**

Implementation idea:

* In group chat there is a **special button "Vocabulary" (բառապաշար)**  
* When teacher uses it:  
  * Admin sees ✅ green indicator  
* If teacher does NOT use it:  
  * Admin sees 🔴 red indicator  
  * System **automatically deducts % from teacher’s payment**

📌 Percentage is configurable in Admin settings.

7. ### **Analytics**

Admin analytics should include:

* Number of lessons per teacher  
* Number of lessons per group  
* Student attendance rate  
* Absence statistics  
* Teacher performance ranking  
* Revenue analytics  
* Payment deductions history  
* Feedback completion rate

### **Suggestion**

1) ### **Student risk indicator**

Student analytics should include a small flag system.

* 🟢 Good attendance  
* 🟡 Risk (frequent absences)  
* 🔴 High risk (unjustified absences)

Admin sees who needs to be called or contacted.

## 

## **2️⃣ Teacher Panel**

### **Sections**

1. Dashboard  
2. Chat  
3. Settings / Profile  
4. Daily Plan \>\> Students Feedbacks  
5. Students  
6. Analytics  
7. Absence/attendance \>\> attendance registry  
8. Salary  
9. Graphics

1. ### **Dashboard**

Teacher sees:

* Today’s lessons  
* Assigned groups  
* Pending feedback tasks  
* Required voice messages (not submitted yet)  
* Salary earned (real-time)

	

2. ### **Chat**

* Teachers can send message to any student  
* Teachers can create and have group chat with his group lesson  
* After each lesson:  
* Teacher MUST send **voice or text message** in **group chat**  
* Topic: **daily vocabulary / lesson summary**

3. ### **Settings / Profile**

     
* Personal info: name, surname, phone, email  
* Change password  
* Bio / short info (optional)  
* Availability / working days  
* Linked groups (read-only)


4. ### **Daily Plan**

* Lesson schedule  
* Group details  
* Lesson status (completed / missed)

5. ### **Students**

Teacher can:

* View students list \- per group  
* Submit:  
  * Feedback  
  * Attendance  
  * Notes

6. ### **Analytics**

Teacher personal analytics:

* Lessons conducted  
* Feedback completion rate  
* Voice message compliance  
* Student attendance rate  
* Payment per lesson

7. ### **Absence Module**

Teacher can:

* Mark student as **absent**  
* Absence logic:  
  * Student gets justified(green) and unjustified(red) absence  
  * If student has 1 unjustified absent: system sends **automatic message/email**:  
    “Everything okay? You missed today’s lesson.”

## Admin sees all absence statistics.

### **Suggestion**

1) ### **Mandatory checklist after lesson (Anti-forget system)**

For teacher after lesson popup / checklist.

Before lesson is marked as Completed, system checks:

* ✅ Attendance filled  
* ✅ Feedback submitted  
* ✅ Vocabulary voice/text sent

If any requirement is missing →

❌ lesson cannot be closed → payment not finalized

## 

## **3️⃣ Student Account**

### **Sections**

1. Dashboard  
2. Chat  
3. Settings / Profile  
4. Folder for recordings  
5. Absence  
6. Payments  
7. Analytics

1. ### **Dashboard**

Student sees:

* Upcoming lessons  
* Group info  
* Teacher name  
* Notifications

2. ### **Chat**

3. **Settings/ profile**  
* Personal info: name, surname, phone, email  
* Change password  
* Level / group info (read-only or request change)  
* Parent contact   
* Option for student to choose whether they want monthly notification/report or not

4. ### **Folder for recordings**

* Access all **teacher voice messages**  
* **Access all their daily voice messages**  
* Sorted by:  
  * Date  
  * Lesson  
* Can replay anytime (important for learning)

5. ### **Absence**

Student can:

* See:  
  * Own absences  
  * Remaining allowed absences  
* Receive automated messages when absent

6. ### **Payments**

Student sees:

* Payment history  
* Upcoming payments  
* Paid / unpaid status

7. ### **Analytics**

Student analytics:

* Attendance rate  
* Progress overview  
* Lesson participation

Each lesson must have a status:

* Scheduled  
* In progress  
* Completed  
* Missed (teacher absent)  
* Replaced


# **CHAT FUNCTIONAL**

### **Chat capabilities (for all roles)**

Chat system must support:

* Text messages  
* Voice messages  
* Image upload  
* Video upload  
* File upload (PDF / DOC – optional)

### **Chat types**

#### **1️⃣ Group Chat (Lesson-based)**

* Each group has its **own permanent group chat**  
* Members:  
  * Assigned teacher  
  * All students of the group

* Used for:  
  * Daily communication  
  * Lesson-related discussions  
  * Mandatory “Vocabulary / Lesson Summary” voice or text

📌 **Mandatory rule**  
 After each lesson, teacher MUST send:

* Voice OR text message  
* Topic: daily vocabulary / lesson summary  
* Sent ONLY through the group chat

#### 

#### **2️⃣ Direct Chat (1-to-1)**

* Teacher ↔ Student  
* Admin ↔ Teacher  
* Admin ↔ Student

Used for:

* Personal questions  
* Warnings  
* Payment / absence explanations

#### **3️⃣ System Messages (Automated)**

System-generated messages appear inside chat:

* Missing feedback warning  
* Unjustified absence notification  
* Payment delay notice  
* Lesson reminders

📌 These messages:

* Are marked as “System”  
* Cannot be deleted by users

### **Special Chat Controls (Admin-visible)**

In group chat:

* "Vocabulary" button (բառապաշար - vocabulary)  
* When pressed by teacher:  
  * Admin sees ✅ green indicator  
* If not pressed:  
  * Admin sees 🔴 red indicator  
  * Deduction logic applies automatically

### 

### **Chat Moderation (Admin)**

Admin can:

* View all chats (read-only or full access – configurable)  
* Send messages to any chat  
* Delete messages (optional, for violations)

# **IMPORTANT NOTES**

1) Search functionality must be available, comprehensive search must be available in each board  
2) Payment system must be integrated so that students can make monthly payments  
3) Notification system - automated messages and calls system, for example if a student is absent an automatic message is sent, if a student delays payment an automatic call is made  
4) The site will be bilingual - primary language will be English, the other will be Armenian  
5) Overall site structure: students and teachers must be separated not by groups but by centers, and then by groups within each center. For example, we have 4 centers, each center has its groups, and each group has its students

# ✅ Site Structure

# **SITE STRUCTURE**

## **1️⃣ System Level (Entire System)**

The system consists of 3 main subsystems + common shared systems.

### 

### **Core Subsystems**

1. Admin System  
2. Teacher System  
3. Student System

### **Shared Systems**

1. Authentication System  
2. Chat System  
3. Notification System  
4. Payment System  
5. Analytics System

This is already the skeleton of the entire project.

## 

## **2️⃣ Admin System (Structure)**

Purpose: management, monitoring, finance, analytics

### **Includes:**

* Dashboard & KPIs  
* Teachers management  
* Students management  
* Finance & payments  
* Analytics & reports  
* Absence / attendance registry  
* System settings  
* Chat oversight

❗ Admin has all permissions (full system access).

## **3️⃣ Teacher System (Structure)**

Նպատակ՝ դասերի իրականացում, հաշվետվություն, աշխատավարձ

### **Ներառում է՝**

* Teacher dashboard  
* Lesson / daily plan management  
* Students interaction  
* Attendance & absence marking  
* Mandatory feedback & vocabulary logic  
* Salary & deductions view  
* Personal analytics  
* Chat participation

## 

## **4️⃣ Student System (Structure)**

Purpose: learning, monitoring, payment

### **Includes:**

* Student dashboard  
* Lesson access & info  
* Voice recordings library  
* Attendance & absence view  
* Monthly payments  
* Personal analytics  
* Chat participation  
* Profile & preferences


## **5️⃣ Authentication & Access Control (Shared)**

* Login  
* Password recovery  
* Role-based access  
* Center-based separation (centers → groups → students)

📌 This is not a separate UI, but a system layer.

## 

## **6️⃣ Chat System (Shared Core Module)**

One unified chat system for all roles.

### **Includes:**

* Group chats (lesson-based)  
* Direct chats (1-to-1)  
* System messages (automated)  
* Special controls (Vocabulary button, indicators)

📌 Chat is not an Admin or Teacher page, but a shared module.

## **7️⃣ Payment System (Shared Core Module)**

Purpose: student monthly payments

### **Includes:**

* Student payments  
* Payment status tracking  
* Payment history  
* Overdue logic  
* Notifications on delays

❗ Providers are not specified here (that is a tech requirement).

## 

## **8️⃣ Notification System (Shared Core Module)**

Automated communication.

### **Includes:**

* Email notifications  
* System notifications  
* Automated alerts  
* Absence / payment / feedback warnings

## **9️⃣ Analytics System (Shared, Role-based)**

Data collection and analysis.

### **Includes:**

* Admin analytics (global)  
* Teacher analytics (personal)  
* Student analytics (personal)  
* Risk indicators

# ✅ Nav. Structure

# **NAVIGATION STRUCTURE**

## 

## **1️⃣ Admin Navigation**

### **Top-level Navigation (Sidebar or Main Menu)**

* Dashboard  
* Teachers  
* Students  
* Finance  
* Analytics  
* Reports  
* Calendar  
* Absence / Attendance  
* Chat  
* Settings

### **Admin → Dashboard**

* Overview KPIs  
* Alerts / Red flags

### **Admin → Teachers**

* Teachers list  
* Teacher profile

  * Groups  
  * Lessons  
  * Salary  
  * Compliance (feedback / vocabulary)

### **Admin → Students**

* Students list  
* Student profile

  * Attendance  
  * Absences  
  * Payments  
  * Performance

### **Admin → Finance**

* Payments per lesson  
* Payments per teacher  
* Total income  
* Outstanding balances  
* Deduction rules

### **Admin → Analytics**

* Teacher analytics  
* Student analytics  
* Attendance stats  
* Revenue analytics  
* Risk indicators

### **Admin → Reports**

* Attendance reports  
* Payment reports  
* Absence reports

### **Admin → Calendar**

* Lessons schedule  
* Group-based view  
* Teacher-based view

### **Admin → Absence / Attendance**

* Absence registry (attendance registry)  
* Justified / unjustified view

### **Admin → Chat**

* Group chats (view / manage)  
* Direct chats  
* System messages

### **Admin → Settings**

* Profile  
* System rules  
* Deduction %  
* Notification rules

## 

## **2️⃣ Teacher Navigation**

### **Top-level Navigation**

* Dashboard  
* Daily Plan  
* Students  
* Analytics  
* Absence / Attendance  
* Salary  
* Calendar  
* Chat  
* Settings

### **Teacher → Dashboard**

* Today’s lessons  
* Pending feedback  
* Missing vocabulary  
* Real-time salary

### **Teacher → Daily Plan**

* Lesson list  
* Lesson details

  * Group  
  * Students  
  * Status (scheduled / completed / missed)

### **Teacher → Students**

* Students by group  
* Student details

  * Feedback  
  * Attendance  
  * Notes

### **Teacher → Analytics**

* Lessons conducted  
* Feedback completion  
* Voice compliance  
* Attendance rate

### **Teacher → Absence / Attendance**

* Mark attendance  
* Justified / unjustified absence

### **Teacher → Salary**

* Salary summary  
* Lesson-based earnings  
* Deductions history

### **Teacher → Calendar**

* Personal lesson schedule

### **Teacher → Chat**

* Group chats  
* Direct chats  
* System messages

### **Teacher → Settings**

* Profile  
* Password  
* Bio  
* Availability

## 

## **3️⃣ Student Navigation**

### **Top-level Navigation**

* Dashboard  
* Lessons / Recordings  
* Payments  
* Analytics  
* Absence  
* Chat  
* Settings

### **Student → Dashboard**

* Upcoming lessons  
* Group info  
* Notifications

### **Student → Lessons / Recordings**

* Voice recordings library  
* Lesson history  
* Replay access

### **Student → Payments**

* Payment history  
* Upcoming payments  
* Status (paid / unpaid)

### **Student → Analytics**

* Attendance rate  
* Progress overview

### **Student → Absence**

* Absence history  
* Remaining allowed absences

### **Student → Chat**

* Group chat  
* Direct chat  
* System messages

### **Student → Settings**

* Profile  
* Password  
* Parent contact  
* Notification preferences

# ✅ Sitemap

# **SITEMAP / USER FLOWS**

**1\) AUTH FLOW (All roles)**

Login  
\- Correct credentials → Redirect to Role Dashboard  
\- Wrong credentials → Error message  
\- Forgot password → Email → Reset → Login

**2\) ADMIN — CORE FLOWS**

**A) Dashboard**  
\- KPIs / Alerts (red flags)  
\- Alert click → Redirect to:  
  \- Teacher profile (compliance issues)  
  \- Student profile (risk / payment / absences)  
  \- Finance (outstanding / deductions)  
  \- Absence registry (patterns)

**B) Chat**  
Admin → Chat  
\- Group chats  
  \- Select group chat → View messages  
  \- View “Vocabulary button” status:  
    \- Green ✅ if used  
    \- Red 🔴 if missing → deduction applies  
  \- Optional admin action:  
    \- Send message to group  
    \- Delete message (optional, policy-based)  
\- Direct chats  
  \- Admin ↔ Teacher  
  \- Admin ↔ Student  
  \- Select chat → Send message / warnings / clarifications  
\- System messages feed  
  \- Filter by type (absence / payment delay / missing feedback)  
  \- Click → opens related user/profile/context

**C) Settings / Profile**  
Admin → Settings / Profile  
\- Profile settings  
  \- Update personal info  
  \- Change password

**D) Teachers**   
Admin → Teachers list  
\- Filter/sort teachers → Select teacher  
\- Teacher profile  
  \- Groups assigned  
  \- Lessons conducted  
  \- Students count  
  \- Salary calculation  
  \- Compliance indicators:  
    \- Feedback completion  
    \- Vocabulary button usage  
\- Admin actions:  
  \- Add / edit / deactivate teacher  
  \- Assign teacher to group  
  \- Send warning (manual) → appears in direct chat \+ optional email

**E) Students**  
Admin → Students list  
\- Filter (group / teacher / level / payment status / absence count)  
\- Select student → Student profile  
  \- Attendance overview  
  \- Absence history (justified/unjustified)  
  \- Payments:  
    \- paid / unpaid / overdue  
    \- payment history  
  \- Performance analytics  
  \- Risk flag view (🟢/🟡/🔴)  
\- Admin actions:  
  \- Message student/parent (direct chat)  
  \- Mark follow-up needed (optional workflow)

**F) Finance** (already; add more detail)  
Admin → Finance  
\- Revenue overview (daily/weekly/monthly)  
\- Teacher payouts  
  \- Per teacher → breakdown by lesson  
  \- Deductions history (reason: missing feedback / missing vocabulary)  
\- Outstanding balances  
  \- By student / group / center  
  \- Action: notify (system message/email/call) \+ report export

**G) Analytics** (missing; adding)  
Admin → Analytics  
\- Teacher performance ranking  
  \- Lessons conducted  
  \- Feedback completion rate  
  \- Voice/vocabulary compliance rate  
  \- Deductions frequency  
\- Student analytics  
  \- Attendance rate  
  \- Absence trends  
  \- Risk indicators  
\- Revenue analytics  
  \- Income trends  
  \- Overdue payments trends  
\- Click any metric → drill-down to:  
  \- Teacher profile  
  \- Student profile  
  \- Group/center view (if enabled)

**H) Reports** 

**I) Graphics** \>\> appointments  
Admin → Graphics / Appointments (Calendar)  
\- Calendar view (day/week/month)  
\- Filter by:  
  \- Teacher  
  \- Group  
  \- Center  
\- Click lesson slot → opens:  
  \- Lesson details (status, teacher, group)  
  \- Quick links to related:  
    \- Group chat  
    \- Attendance/absence  
    \- Teacher profile

**J) Absence / attendees** **\>\> attendance registry**  
Admin → Absence / Attendance registry  
\- Filter by:  
  \- Student / group / teacher / center  
  \- Date range  
  \- Justified vs unjustified  
\- Open record → details \+ history  
\- System triggers:  
  \- If unjustified absence → auto message to student  
\- Admin actions:  
  \- Add note / follow-up  
  \- Generate report

**3\) TEACHER — CORE FLOWS**

**A) Dashboard**   
\- Today’s lessons  
\- Assigned groups  
\- Pending actions:  
  \- Missing feedback  
  \- Missing vocabulary (voice/text)  
\- Salary earned (real-time)  
\- Alerts / reminders

**B) Daily Plan**  
Teacher → Daily Plan  
\- Lessons list (by date)  
\- Lesson statuses:  
  \- Scheduled  
  \- In progress  
  \- Completed  
  \- Missed  
  \- Replaced

Flow:  
Daily Plan → Select lesson → Lesson page:  
\- View group & students  
\- Mark attendance  
\- Submit feedback (per student)  
\- Send vocabulary (voice/text) via Group Chat  
\- Complete lesson

Completion logic:  
\- If ALL required actions done →  
  Lesson marked as Completed  
  Salary finalized  
\- If ANY missing →  
  Lesson completion BLOCKED  
  Warning shown

**C) Students**  
Teacher → Students  
\- Groups list  
\- Select group → Students list

Flow:  
Students list → Select student:  
\- View student info (limited)  
\- Submit feedback  
\- Mark attendance / absence  
\- Add notes (internal)

Rules:  
\- Teacher cannot edit payments  
\- Teacher cannot edit student profile data

**D) Absence / Attendance**  
Teacher → Absence / Attendance

Flow:  
\- Select lesson or student  
\- Mark absence:  
  \- Justified  
    → Status updated  
  \- Unjustified  
    → System auto message sent to student  
    → Admin notified (analytics)

Rules:  
\- Absence must be recorded before lesson completion  
\- Absence affects analytics, not salary (unless teacher absent)

**E) Salary**  
Teacher → Salary  
\- Salary summary  
\- Earnings per lesson  
\- Deductions history  
  \- Reason:  
    \- Missing feedback  
    \- Missing vocabulary  
    \- Other penalties  
\- Total earned (real-time)

Flow:  
\- Click lesson → Salary breakdown for that lesson  
\- Click deduction → Reason details

**F) Analytics**  
Teacher → Analytics  
\- Lessons conducted  
\- Feedback completion rate  
\- Vocabulary/voice compliance  
\- Student attendance rate  
\- Earnings statistics

Flow:  
\- Click metric → Filtered lesson list  
\- No access to other teachers’ data

\------------------------------------------------

**G) Calendar / Graphics**  
Teacher → Calendar  
\- Personal lesson schedule (day/week/month)  
\- Lesson status indicators (color-coded)

Flow:  
\- Click lesson slot → Lesson page

**H) Chat**  
Teacher → Chat

Chat types:  
1\) Group Chats (lesson-based)  
\- Mandatory vocabulary flow:  
  Lesson completed → Group chat →  
  Teacher sends voice/text vocabulary  
    \- Sent → Admin sees GREEN indicator ✅  
    \- Not sent → Admin sees RED indicator 🔴 → Deduction

2\) Direct Chats  
\- Teacher ↔ Student  
\- Teacher ↔ Admin

Flow:  
\- Open chat → Send / receive messages  
\- System messages visible but not editable

**I) Settings / Profile**  
Teacher → Settings / Profile  
\- Personal info  
\- Change password  
\- Bio / short info  
\- Availability / working days

Flow:  
\- Update info → Save → Confirmation

**4\) STUDENT — CORE FLOWS**

**A) Dashboard**   
\- Upcoming lessons (next lessons list)  
\- Group info (center, group name)  
\- Teacher name  
\- Notifications (system \+ reminders)  
\- Quick links:  
  \- Payments  
  \- Recordings  
  \- Absence

Flows:  
\- Click upcoming lesson → Lesson details (read-only)  
\- Click notification → Related section (Payments / Absence / Chat)  
\- Click quick link → opens target module

**B) Lessons / Recordings**  
Student → Lessons / Recordings

Content:  
\- Recordings folder/library  
  \- Daily vocabulary / lesson summary messages  
\- Sorted by:  
  \- Date  
  \- Lesson

Flows:  
\- Open library → Filter (date/lesson) → Select item → Play / Replay  
\- Search recordings (global search requirement)  
\- If no recordings → Empty state (“No recordings yet”)

**C) Chat**   
Chat types:  
1\) Group Chat (permanent per group)  
\- Used for:  
  \- Daily communication  
  \- Lesson discussions  
  \- Teacher’s mandatory vocabulary/summary messages  
Flow:  
\- Open group chat → read messages → send message (text/voice/media)

2\) Direct Chat  
\- Student ↔ Teacher  
\- Student ↔ Admin (if enabled)  
Flow:  
\- Open direct chat → send question → receive reply

3\) System Messages  
\- Absence warnings  
\- Payment delay notices  
\- Lesson reminders

**D) Payments**   
\- Payment status: Paid / Unpaid / Overdue  
\- Upcoming payments  
\- Payment history

Core flow:  
Payments → Upcoming payment → Pay now → Payment provider page  
\- Success → status updated → success message → receipt/record added  
\- Fail → error shown → retry option

Overdue flow:  
Payment becomes overdue → system notification appears (chat \+ email)  
\- Student opens Payments → sees overdue banner → Pay now

Rules:  
\- Student can view full payment history  
\- Student cannot change payment rules  
\- Payment reminders are automated

**E) Absence**

Content:  
\- Absence list/history  
\- Remaining allowed absences (if defined)  
\- Absence type:  
  \- Justified (green)  
  \- Unjustified (red)

Flows:  
\- View absence history → open record details  
\- Receive system message if absent:  
  “Everything okay? You missed today’s lesson.”  
\- Student sees updated count of absences

Rules:  
\- Student cannot “approve” absence type (teacher/admin decides)

**F) Analytics**  
Metrics:  
\- Attendance rate  
\- Progress overview  
\- Lesson participation

Flow:  
\- Open analytics → select metric → view breakdown (by date/lesson)

**G) Settings / Profile**  
Profile settings:  
\- Personal info: name, surname, phone, email  
\- Change password  
\- Level / group info (read-only or request change)  
\- Parent contact

Flows:  
\- Update personal info → Save → confirmation  
\- Toggle monthly report → Save → confirmation

**5\) CHAT SYSTEM FLOWS (Shared)**

5.1 Group Chat Mandatory Vocabulary Flow  
Lesson completed → Group chat:  
\- Teacher sends vocabulary:  
\- Sent → Admin sees GREEN indicator ✅  
\- Not sent → Admin sees RED indicator 🔴 → Deduction applies

5.2 Direct Communication  
User (Admin / Teacher / Student) → Direct chat → Message → Reply

5.3 System Messages  
Trigger event (absence / missing feedback / payment delay / reminders) →  
\- System message appears in chat (marked “System”, cannot be deleted)  
\- Notification sent (email / in-app; optional call)

**6\) NOTIFICATIONS & AUTOMATIONS (Summary)**

\- Missed lesson  
\- Missing feedback  
\- Unjustified absence  
\- Payment delay

→ System actions:  
\- Chat system message  
\- Email notification  
\- Optional call automation  
