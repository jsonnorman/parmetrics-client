# Par Metrics

Par Metrics is a full-stack golf scorecard management application designed to help golfers organize, manage, and share digital course scorecards. Users can create courses with multiple tee boxes, build 9-hole or 18-hole scorecards, and save favorite courses created by other users.

---

## Related Repository

**Backend API**

https://github.com/jsonnorman/parmetricapi

---

## Repository Layout

| Folder | Description | Stack |
|---------|-------------|-------|
| `src/` | React application components, pages, services, and styling | React, JavaScript, Vite |
| `public/` | Static assets | Vite |

The frontend communicates with the Django REST API using the Fetch API over HTTP.

---

# Features

- User registration and login
- Secure token authentication
- Dashboard displaying created and favorited courses
- Create, edit, and delete golf courses
- Add multiple tee boxes to each course
- Support for both 9-hole and 18-hole scorecards
- Favorite and unfavorite courses
- Owner-only editing and deletion
- Responsive golf-themed user interface

---

# Technologies Used

### Frontend

- React
- React Router
- JavaScript (ES6)
- CSS
- Fetch API
- Vite

### Backend

- Django
- Django REST Framework
- SQLite

---

# Database Design

Par Metrics utilizes a relational database with the following relationships:

- One User can create many Courses.
- One Course can contain many Tee Boxes.
- One Tee Box contains many Holes.
- Users and Courses share a many-to-many relationship through the Favorites table.

Ownership validation is enforced on the backend to ensure users can only modify resources they created.

---

# Installation

## Clone the repository

```bash
git clone https://github.com/jsonnorman/parmetrics-client.git
```

## Install dependencies

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

The frontend runs at:

```
http://localhost:5173
```

The backend API must also be running.

---

# Authentication

Par Metrics uses Django REST Framework Token Authentication.

Users can:

- Register
- Login
- Access protected endpoints
- Create and manage their own courses
- Favorite courses created by other users

---

# Author

**Jason Norman**

Nashville Software School

Full Stack Software Development Capstone