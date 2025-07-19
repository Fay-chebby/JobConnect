import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { Job, Application, JobSeekerStats, EmployerStats } from "@/types";

const API_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<JobSeekerStats | EmployerStats>(
    {} as JobSeekerStats | EmployerStats
  );
  const getApplicantName = (jobSeeker) => {
    if (typeof jobSeeker === "string") return jobSeeker;
    return jobSeeker?.user?.name || jobSeeker?.name || "Unknown Applicant";
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !token) return;

      setLoading(true);
      try {
        if (user.role === "jobSeeker") {
          // Fetch recommended jobs and job applications for job seekers
          const [jobsResponse, applicationsResponse] = await Promise.all([
            axios.get(`${API_URL}/jobs?limit=5`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/applications`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setJobs(jobsResponse.data.data);
          setApplications(applicationsResponse.data.data);

          // Calculate stats for job seeker
          const jobSeekerStats: JobSeekerStats = {
            totalApplications: applicationsResponse.data.count,
            pendingApplications: applicationsResponse.data.data.filter(
              (app: Application) => app.status === "pending"
            ).length,
            interviewedApplications: applicationsResponse.data.data.filter(
              (app: Application) => app.status === "interviewed"
            ).length,
          };

          setStats(jobSeekerStats);
        } else if (user.role === "employer") {
          // Fetch posted jobs and received applications for employers
          const [postedJobsResponse, recentApplicationsResponse] =
            await Promise.all([
              axios.get(`${API_URL}/jobs?employer=${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get(`${API_URL}/applications/received`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

          setJobs(postedJobsResponse.data.data);
          setApplications(recentApplicationsResponse.data.data.slice(0, 5)); // Show only 5 recent applications

          // Calculate stats for employer
          const employerStats: EmployerStats = {
            totalJobs: postedJobsResponse.data.count,
            activeJobs: postedJobsResponse.data.data.filter(
              (job: Job) => job.status === "open"
            ).length,
            totalApplications: recentApplicationsResponse.data.count,
          };

          setStats(employerStats);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  // Job Seeker Dashboard
  if (user?.role === "jobSeeker") {
    const jobSeekerStats = stats as JobSeekerStats;

    return (
      <Container className="py-5">
        <h1 className="mb-4">Job Seeker Dashboard</h1>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Total Applications</Card.Title>
                <div className="display-4 fw-bold my-3">
                  {jobSeekerStats.totalApplications || 0}
                </div>
                <Card.Text>Jobs you've applied to</Card.Text>
                <Link to="/applications">
                  <Button variant="outline-primary">
                    View All Applications
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Pending Review</Card.Title>
                <div className="display-4 fw-bold my-3">
                  {jobSeekerStats.pendingApplications || 0}
                </div>
                <Card.Text>Applications awaiting employer review</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Interviews</Card.Title>
                <div className="display-4 fw-bold my-3">
                  {jobSeekerStats.interviewedApplications || 0}
                </div>
                <Card.Text>Applications that reached interview stage</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Your Recent Applications</h5>
                <Link to="/applications">
                  <Button variant="light" size="sm">
                    View All
                  </Button>
                </Link>
              </Card.Header>
              <Card.Body>
                {applications.length > 0 ? (
                  applications.slice(0, 5).map((application: Application) => (
                    <div
                      key={application._id}
                      className="mb-3 pb-3 border-bottom"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{application.job.title}</h6>
                          <p className="mb-1 text-muted small">
                            {application.job.employer.companyName} -{" "}
                            {application.job.location}
                          </p>
                          <p className="mb-0 small">
                            Applied:{" "}
                            {new Date(
                              application.appliedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          bg={
                            application.status === "pending"
                              ? "secondary"
                              : application.status === "reviewed"
                              ? "info"
                              : application.status === "interviewed"
                              ? "primary"
                              : application.status === "offered"
                              ? "success"
                              : "danger"
                          }
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">
                    You haven't applied to any jobs yet.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recommended Jobs</h5>
                <Link to="/jobs">
                  <Button variant="light" size="sm">
                    Browse All Jobs
                  </Button>
                </Link>
              </Card.Header>
              <Card.Body>
                {jobs.length > 0 ? (
                  jobs.map((job: Job) => (
                    <div key={job._id} className="mb-3 pb-3 border-bottom">
                      <h6 className="mb-1">{job.title}</h6>
                      <p className="mb-1 text-muted small">
                        {job.employer.companyName} - {job.location}
                      </p>
                      <div className="mb-2">
                        <Badge bg="secondary" className="me-2">
                          {job.jobType}
                        </Badge>
                        <Badge bg="info">
                          {job.salary?.min
                            ? `$${job.salary.min} - $${job.salary.max}`
                            : "Salary not specified"}
                        </Badge>
                      </div>
                      <div className="d-flex">
                        <Link to={`/jobs/${job._id}`}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Button variant="primary" size="sm">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">
                    No recommended jobs available at the moment.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Employer Dashboard
  const employerStats = stats as EmployerStats;

  return (
    <Container className="py-5">
      <h1 className="mb-4">Employer Dashboard</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Total Job Postings</Card.Title>
              <div className="display-4 fw-bold my-3">
                {employerStats.totalJobs || 0}
              </div>
              <Card.Text>Jobs you've posted</Card.Text>
              <Link to="/manage-jobs">
                <Button variant="outline-primary">Manage Jobs</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Active Jobs</Card.Title>
              <div className="display-4 fw-bold my-3">
                {employerStats.activeJobs || 0}
              </div>
              <Card.Text>Currently accepting applications</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Total Applications</Card.Title>
              <div className="display-4 fw-bold my-3">
                {employerStats.totalApplications || 0}
              </div>
              <Card.Text>Candidates who applied to your jobs</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Your Job Postings</h5>
              <div>
                <Link to="/post-job">
                  <Button variant="light" size="sm" className="me-2">
                    Post New Job
                  </Button>
                </Link>
                <Link to="/manage-jobs">
                  <Button variant="light" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {jobs.length > 0 ? (
                jobs.slice(0, 3).map((job: Job) => (
                  <div key={job._id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{job.title}</h6>
                        <p className="mb-1 text-muted small">
                          Location: {job.location}
                        </p>
                        <p className="mb-0 small">
                          Posted: {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Badge
                          bg={
                            job.status === "open"
                              ? "success"
                              : job.status === "closed"
                              ? "danger"
                              : "warning"
                          }
                          className="me-2"
                        >
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </Badge>
                        <Badge bg="primary">
                          {job.applications?.length || 0} Applications
                        </Badge>
                      </div>
                    </div>
                    <div className="d-flex mt-2">
                      <Link to={`/jobs/${job._id}/edit`}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Link to={`/jobs/${job._id}/applications`}>
                        <Button variant="primary" size="sm">
                          View Applications
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">You haven't posted any jobs yet.</p>
              )}

              {jobs.length > 0 && (
                <div className="text-center mt-3">
                  <Link to="/manage-jobs">
                    <Button variant="outline-primary">
                      View All Job Postings
                    </Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Applications</h5>
              <Link to="/applications/received">
                <Button variant="light" size="sm">
                  View All
                </Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {applications.length > 0 ? (
                applications.map((application: Application) => (
                  <div
                    key={application._id}
                    className="mb-3 pb-3 border-bottom"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">
                          {getApplicantName(application?.jobSeeker)}
                          <span className="text-muted"> applied for </span>
                          {application?.job?.title || "Unknown Job"}
                        </h6>

                        <p className="mb-1 small">
                          Applied:{" "}
                          {application?.appliedDate
                            ? new Date(
                                application.appliedDate
                              ).toLocaleDateString()
                            : "Unknown Date"}
                        </p>
                      </div>

                      <Badge
                        bg={
                          application.status === "pending"
                            ? "secondary"
                            : application.status === "reviewed"
                            ? "info"
                            : application.status === "interviewed"
                            ? "primary"
                            : application.status === "offered"
                            ? "success"
                            : "danger"
                        }
                      >
                        {application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="d-flex mt-2">
                      <Link to={`/applications/${application._id}`}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                        >
                          View Details
                        </Button>
                      </Link>
                      <Button variant="success" size="sm" className="me-2">
                        Mark as Reviewed
                      </Button>
                      <Button variant="primary" size="sm">
                        Schedule Interview
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">
                  No applications have been received yet.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
