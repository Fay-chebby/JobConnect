import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Job {
  _id: string;
  title: string;
  location: string;
  jobType: string;
  postedDate: string;
  applicationsCount: number;
  status: string;
  expiryDate: string;
}

const MyPostedJobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      if (!user || user.role !== "employer") {
        setError("You must be logged in as an employer to view this page");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/jobs/employer/${user.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        setJobs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching employer jobs:", err);
        setError("Failed to load your posted jobs. Please try again.");
        setLoading(false);
      }
    };

    fetchEmployerJobs();
  }, [user]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete job");

      setJobs((prevJobs) =>
        prevJobs.filter((job) => job._id !== jobToDelete._id)
      );
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  if (loading)
    return <div className="text-center my-5">Loading your posted jobs...</div>;

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!user || user.role !== "employer") {
    return (
      <Alert variant="warning">
        You must be logged in as an employer to view this page
      </Alert>
    );
  }

  const activeJobs = jobs.filter((job) => job.status === "Active");
  const closedJobs = jobs.filter((job) => job.status === "Closed");

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Posted Jobs</h1>
        <Link to="/employer/post-job">
          <Button variant="success">
            <i className="bi bi-plus-circle me-2"></i>
            Post New Job
          </Button>
        </Link>
      </div>

      <h3 className="h5 mb-3">Active Jobs ({activeJobs.length})</h3>
      {activeJobs.length > 0 ? (
        activeJobs.map((job) => (
          <Card key={job._id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {job.location} • {job.jobType}
                  </Card.Subtitle>
                </div>
                <Badge bg="success">Active</Badge>
              </div>

              <div className="mt-3 d-flex flex-wrap gap-3">
                <div>
                  <small className="text-muted d-block">Posted on</small>
                  <span>{formatDate(job.postedDate)}</span>
                </div>
                <div>
                  <small className="text-muted d-block">Expires on</small>
                  <span>{formatDate(job.expiryDate)}</span>
                </div>
                <div>
                  <small className="text-muted d-block">Applications</small>
                  <span>{job.applicationsCount}</span>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link to={`/employer/applications/${job._id}`}>
                  <Button variant="primary">View Applications</Button>
                </Link>
                <Link to={`/employer/edit-job/${job._id}`}>
                  <Button variant="outline-secondary">Edit Job</Button>
                </Link>
                <Button
                  variant="outline-danger"
                  onClick={() => handleDeleteClick(job)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">You don't have any active job postings</Alert>
      )}

      <h3 className="h5 mb-3 mt-5">Closed Jobs ({closedJobs.length})</h3>
      {closedJobs.length > 0 ? (
        closedJobs.map((job) => (
          <Card key={job._id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {job.location} • {job.jobType}
                  </Card.Subtitle>
                </div>
                <Badge bg="secondary">Closed</Badge>
              </div>

              <div className="mt-3 d-flex flex-wrap gap-3">
                <div>
                  <small className="text-muted d-block">Posted on</small>
                  <span>{formatDate(job.postedDate)}</span>
                </div>
                <div>
                  <small className="text-muted d-block">Expired on</small>
                  <span>{formatDate(job.expiryDate)}</span>
                </div>
                <div>
                  <small className="text-muted d-block">Applications</small>
                  <span>{job.applicationsCount}</span>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link to={`/employer/applications/${job._id}`}>
                  <Button variant="primary">View Applications</Button>
                </Link>
                <Button variant="outline-success">Repost Job</Button>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">You don't have any closed job postings</Alert>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {jobToDelete && (
            <p>
              Are you sure you want to delete the job posting for "
              {jobToDelete.title}"? This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Job
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyPostedJobs;
