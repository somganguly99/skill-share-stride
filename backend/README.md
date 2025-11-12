# EduLearn Backend Setup (XAMPP/PHP/MySQL)

## File Structure

```
backend/
├── api/
│   ├── login.php
│   ├── register.php
│   ├── courses.php
│   ├── enroll.php
│   ├── admin/
│   │   ├── enrollments.php
│   │   └── courses.php
│   ├── quiz/
│   │   ├── create.php
│   │   ├── get.php
│   │   └── attempt.php
│   └── certificate/
│       ├── generate.php
│       └── get.php
├── config/
│   └── database.php
├── includes/
│   ├── cors.php
│   └── helpers.php
└── .htaccess
```

## Installation Steps

1. **Copy backend folder to XAMPP htdocs**
   ```
   C:/xampp/htdocs/edulearn-api/
   ```

2. **Import database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create database `course_management`
   - Run the SQL schema you provided

3. **Update database credentials**
   - Edit `config/database.php` with your MySQL credentials

4. **Update frontend API URL**
   - In your React app, update `src/lib/api.ts`:
   ```javascript
   const API_BASE_URL = 'http://localhost/edulearn-api';
   ```

5. **Test the connection**
   - Visit: http://localhost/edulearn-api/api/courses.php
   - Should return empty array or existing courses

## API Endpoints

All endpoints are prefixed with `http://localhost/edulearn-api/api/`

- POST `/login.php` - User login
- POST `/register.php` - User registration
- GET `/courses.php` - Get all courses
- GET `/courses.php?id=1` - Get course by ID
- POST `/courses.php` (method=request) - Create course request
- POST `/enroll.php` - Enroll in course
- GET `/enroll.php?studentId=1` - Get student enrollments
- GET `/admin/enrollments.php?pending=true` - Get pending enrollments
- POST `/admin/enrollments.php` (method=approve/reject) - Approve/reject enrollment
- GET `/admin/courses.php?pending=true` - Get pending courses
- POST `/admin/courses.php` (method=approve/reject) - Approve/reject course
- DELETE `/admin/enrollments.php` (method=remove) - Remove student from course
- POST `/quiz/create.php` - Create quiz
- GET `/quiz/get.php?courseId=1` - Get course quizzes
- POST `/quiz/attempt.php` - Submit quiz attempt
- POST `/certificate/generate.php` - Generate certificate
- GET `/certificate/get.php?studentId=1&courseId=1` - Get certificate

## CORS Configuration

The backend includes CORS headers to allow requests from your React frontend running on different port.
