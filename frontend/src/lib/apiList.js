// export const server = "http://localhost:4444";
export const server =  "https://billboard-management-system.onrender.com";
const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  uploadResume: `${server}/upload/resume`,
  uploadProfileImage: `${server}/upload/profile`,
  jobs: `${server}/api/jobs`,
  applications: `${server}/api/applications`,
  rating: `${server}/api/rating`,
  user: `${server}/api/user`,
  applicants: `${server}/api/applicants`,
  forgotPassword: `${server}/auth/forgot-password`,
  resetPassword: `${server}/auth/reset-password`,
};

export default apiList;
