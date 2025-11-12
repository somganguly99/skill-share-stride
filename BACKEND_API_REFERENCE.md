# Backend API Reference for EduLearn

This document describes the API endpoints your XAMPP/MySQL backend needs to implement.

## Base URL
Update `src/lib/api.ts` with your actual backend URL (default: `http://localhost:3000/api`)

## Authentication Endpoints

### POST /api/login
Login for all user types
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student" | "instructor" | "admin"
}

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST /api/register
Register new student or instructor
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student" | "instructor",
  ...other fields
}
```

## Course Endpoints

### GET /api/courses
Get all approved courses

### GET /api/courses/:courseId
Get specific course details

### POST /api/courses/request
Instructor creates new course request
```json
Request:
{
  "CName": "Course Name",
  "CDescription": "Description",
  "Credits": 4,
  "CDuration": "5 hours",
  "videoUrl": "https://youtube.com/watch?v=...",
  "Price": 1500,
  "Level": "beginner",
  "Category": "Programming",
  "instructorId": 1
}
```

## Enrollment Endpoints

### POST /api/enroll
Student enrolls in a course (pending approval)
```json
Request:
{
  "studentId": 1,
  "courseId": 1
}
```

### GET /api/enrollments/student/:studentId
Get student's enrolled courses

## Admin Endpoints

### GET /api/admin/enrollments/pending
Get pending enrollment requests

### POST /api/admin/enrollments/approve
Approve student enrollment
```json
Request:
{
  "studentId": 1,
  "courseId": 1
}
```

### POST /api/admin/enrollments/reject
Reject student enrollment

### GET /api/admin/courses/pending
Get pending course requests

### POST /api/admin/courses/approve
Approve instructor course
```json
Request:
{
  "courseId": 1
}
```

### POST /api/admin/courses/reject
Reject instructor course

### DELETE /api/admin/enrollments/remove
Remove student from course
```json
Request:
{
  "studentId": 1,
  "courseId": 1
}
```

## Quiz Endpoints

### POST /api/quiz
Create quiz for a course
```json
Request:
{
  "courseId": 1,
  "totalMarks": 100,
  "questions": [...]
}
```

### GET /api/quiz/course/:courseId
Get all quizzes for a course

### POST /api/quiz/attempt
Submit quiz attempt
```json
Request:
{
  "studentId": 1,
  "quizId": 1,
  "answers": [...]
}
```

## Certificate Endpoints

### POST /api/certificate/generate
Generate certificate for completed course
```json
Request:
{
  "studentId": 1,
  "courseId": 1
}
```

### GET /api/certificate/:studentId/:courseId
Get certificate details

## Database Schema Mapping

Your existing MySQL tables map to the frontend as follows:
- `Admin` → Admin login and management
- `Instructor` → Instructor login and course creation
- `Student` → Student login and enrollment
- `Course` → Course data with pricing
- `Enrolls_In` → Student-Course enrollment relationship
- `Quiz` → Module quizzes
- `Certificate` → Course completion certificates

## Notes

1. All endpoints should return JSON responses
2. Implement proper error handling (404, 500, etc.)
3. Add CORS headers to allow frontend access
4. Password should be hashed in database (use bcrypt)
5. Consider adding JWT tokens for session management
