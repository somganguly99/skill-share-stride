// API base URL - update this to your XAMPP backend URL
// After copying backend folder to htdocs/edulearn, use:
const API_BASE_URL = 'http://localhost/edulearn/api';

interface LoginResponse {
  success: boolean;
  user?: any;
  message?: string;
}

export const api = {
  // Authentication
  login: async (email: string, password: string, role: 'student' | 'instructor' | 'admin'): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return response.json();
  },

  register: async (data: any, role: 'student' | 'instructor') => {
    const response = await fetch(`${API_BASE_URL}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, role }),
    });
    return response.json();
  },

  // Courses
  getCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses.php`);
    return response.json();
  },

  getCourseById: async (courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/courses.php?id=${courseId}`);
    return response.json();
  },

  createCourseRequest: async (courseData: any, instructorId: number) => {
    const response = await fetch(`${API_BASE_URL}/courses.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...courseData, instructorId }),
    });
    return response.json();
  },

  // Enrollment
  enrollInCourse: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/enroll.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
    return response.json();
  },

  getStudentEnrollments: async (studentId: number) => {
    const response = await fetch(`${API_BASE_URL}/enroll.php?studentId=${studentId}`);
    return response.json();
  },

  // Admin
  getPendingEnrollments: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/enrollments.php?pending=true`);
    return response.json();
  },

  getPendingCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/courses.php?pending=true`);
    return response.json();
  },

  approveEnrollment: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/enrollments.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'approve', studentId, courseId }),
    });
    return response.json();
  },

  rejectEnrollment: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/enrollments.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'reject', studentId, courseId }),
    });
    return response.json();
  },

  approveCourse: async (courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/courses.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'approve', courseId }),
    });
    return response.json();
  },

  rejectCourse: async (courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/courses.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'reject', courseId }),
    });
    return response.json();
  },

  removeStudentFromCourse: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/enrollments.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
    return response.json();
  },

  // Quiz
  createQuiz: async (courseId: number, quizData: any) => {
    const response = await fetch(`${API_BASE_URL}/quiz/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, ...quizData }),
    });
    return response.json();
  },

  getQuizzesByCourse: async (courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/quiz/get.php?courseId=${courseId}`);
    return response.json();
  },

  submitQuizAttempt: async (studentId: number, quizId: number, answers: any) => {
    const response = await fetch(`${API_BASE_URL}/quiz/attempt.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, quizId, answers }),
    });
    return response.json();
  },

  // Certificate
  generateCertificate: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/certificate/generate.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
    return response.json();
  },

  getCertificate: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/certificate/get.php?studentId=${studentId}&courseId=${courseId}`);
    return response.json();
  },
};
