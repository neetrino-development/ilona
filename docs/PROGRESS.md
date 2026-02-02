# Прогресс: Ilona English Center

**Текущий этап:** Frontend Pages - Phase 2
**Общий прогресс:** 65%
**Последнее обновление:** 2026-02-02

---

## 📊 Сравнение со спецификацией (Ilona English.md)

### ✅ Admin Panel (7/10)
| Раздел | Статус | Примечание |
|--------|--------|------------|
| Dashboard | ✅ Done | KPIs, статистика |
| Chat | ✅ Done | WebSocket, real-time |
| Settings/Profile | ✅ Done | Профиль, пароль |
| Teachers | ✅ Done | CRUD, API |
| Students | ✅ Done | CRUD, API |
| Finance | ✅ Done | Payments, Salaries |
| **Analytics** | ❌ TODO | Teacher performance, risk indicators |
| **Reports** | ❌ TODO | Export, печать |
| Calendar | ✅ Done | Week/list view |
| **Attendance Registry** | ❌ TODO | Общий реестр посещаемости |

### ⚠️ Teacher Panel (3/9)
| Раздел | Статус | Примечание |
|--------|--------|------------|
| Dashboard | ✅ Done | Today's lessons, groups |
| Chat | ✅ Done | WebSocket |
| Settings/Profile | ⚠️ Partial | Нужно добавить bio, availability |
| **Daily Plan** | ❌ TODO | Lesson management, feedback |
| **Students** | ❌ TODO | Per-group view, feedback submit |
| **Analytics** | ❌ TODO | Personal stats |
| **Attendance** | ❌ TODO | Mark attendance, absence |
| **Salary** | ❌ TODO | Earnings, deductions |
| **Calendar** | ❌ TODO | Personal schedule |

### ⚠️ Student Panel (2/7)
| Раздел | Статус | Примечание |
|--------|--------|------------|
| Dashboard | ✅ Done | Upcoming lessons |
| Chat | ✅ Done | WebSocket |
| Settings/Profile | ⚠️ Partial | Нужно parent contact, notification prefs |
| **Recordings** | ❌ TODO | Vocabulary voice messages library |
| **Absence** | ❌ TODO | History, remaining absences |
| **Payments** | ❌ TODO | Pay now, history, status |
| **Analytics** | ❌ TODO | Attendance rate, progress |

### ❌ Shared Features (Not Started)
| Feature | Статус | Описание |
|---------|--------|----------|
| **Vocabulary Button** | ❌ TODO | Special chat button for teachers |
| **Auto Deductions** | ❌ TODO | UI for viewing deduction reasons |
| **Risk Indicators** | ❌ TODO | Student flags (🟢🟡🔴) |
| **Email Notifications** | ❌ TODO | Resend integration |
| **System Messages** | ❌ TODO | Automated chat messages |
| **Lesson Checklist** | ❌ TODO | Mandatory steps before completion |
| **Armenian Language** | ⚠️ Partial | i18n setup done, translations needed |

---

## 🎯 Следующие шаги (по приоритету)

### Phase 2A: Teacher Pages (высокий приоритет)
1. **Teacher Daily Plan page** — lesson list, feedback form, complete lesson
2. **Teacher Students page** — per-group students, attendance marking
3. **Teacher Attendance page** — mark present/absent, justified/unjustified
4. **Teacher Salary page** — earnings breakdown, deductions
5. **Teacher Calendar page** — personal schedule

### Phase 2B: Student Pages
6. **Student Payments page** — payment status, pay button, history
7. **Student Absence page** — absence history, remaining count
8. **Student Recordings page** — vocabulary voice messages library

### Phase 2C: Admin Advanced
9. **Admin Analytics page** — teacher performance, student risk, revenue
10. **Admin Attendance Registry** — global attendance view
11. **Admin Reports page** — export, filtering

### Phase 3: Special Features
12. **Vocabulary Button** — special chat control for teachers
13. **Lesson Completion Checklist** — mandatory steps validation
14. **Risk Indicators** — student flags in UI
15. **Email Notifications** — Resend integration

---

## ✅ Выполнено

### Backend API (100%)
- [x] Auth (JWT + RBAC)
- [x] Users, Centers, Groups, Lessons CRUD
- [x] Attendance marking + reports
- [x] Students, Teachers CRUD + dashboards
- [x] Chat (WebSocket + REST)
- [x] Finance (Payments, Salaries, Deductions)
- [x] 81 unit tests

### Frontend Core (100%)
- [x] Next.js 15 + React 19 setup
- [x] Auth store (Zustand + persist)
- [x] React Query integration
- [x] Protected layouts (Admin, Teacher, Student)
- [x] UI components library
- [x] WebSocket chat client

### Frontend Pages (65%)
- [x] Login page
- [x] Admin: Dashboard, Teachers, Students, Finance, Groups, Calendar, Chat, Settings
- [x] Teacher: Dashboard, Chat
- [x] Student: Dashboard, Chat

---

## 📁 Структура страниц

```
apps/web/src/app/[locale]/

(admin)/admin/
├── dashboard/     ✅ Done
├── teachers/      ✅ Done
├── students/      ✅ Done
├── finance/       ✅ Done
├── groups/        ✅ Done
├── calendar/      ✅ Done
├── chat/          ✅ Done
├── settings/      ✅ Done
├── analytics/     ❌ TODO
├── attendance/    ❌ TODO
└── reports/       ❌ TODO

(teacher)/teacher/
├── dashboard/     ✅ Done
├── chat/          ✅ Done
├── daily-plan/    ❌ TODO
├── students/      ❌ TODO
├── attendance/    ❌ TODO
├── salary/        ❌ TODO
├── analytics/     ❌ TODO
├── calendar/      ❌ TODO
└── settings/      ❌ TODO (needs update)

(student)/student/
├── dashboard/     ✅ Done
├── chat/          ✅ Done
├── recordings/    ❌ TODO
├── payments/      ❌ TODO
├── absence/       ❌ TODO
├── analytics/     ❌ TODO
└── settings/      ❌ TODO (needs update)
```

---

## 📊 Прогресс по ролям

| Роль | Готово | Всего | % |
|------|--------|-------|---|
| Admin | 8 | 11 | 73% |
| Teacher | 2 | 9 | 22% |
| Student | 2 | 7 | 29% |
| **Общий** | 12 | 27 | **44%** |

+ Backend API: 100%
+ Frontend Core: 100%
= **Общий прогресс: ~65%**

---

## 🔐 Демо аккаунты

| Роль | Email | Password |
|------|-------|----------|
| Admin | admin@ilona.edu | admin123 |
| Teacher | teacher@ilona.edu | teacher123 |
| Student | student@ilona.edu | student123 |

---

## 📝 Git

**URL:** https://github.com/neetrino-development/ilona-english-center.git
