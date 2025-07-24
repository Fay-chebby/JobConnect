import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Tabs,
  Tab,
  Modal,
  Form,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Application {
  _id: string;
  jobId: string;
  applicantId: string;
  name: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  appliedDate: string;
  status: string;
  lastUpdated: string;
  employerNotes?: string;
  interviewDate?: string;
  interviewDetails?: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  postedDate: string;
  applicationsCount: number;
  status: string;
  expiryDate: string;
}

const ApplicationStatusBadge = ({ status }: { status: string }) => {
  let variant;
  switch (status) {
    case "Submitted":
      variant = "primary";
      break;
    case "Under Review":
      variant = "info";
      break;
    case "Interview":
      variant = "warning";
      break;
    case "Accepted":
      variant = "success";
      break;
    case "Rejected":
      variant = "danger";
      break;
    default:
      variant = "secondary";
  }
  return <Badge bg={variant}>{status}</Badge>;
};

const JobApplications = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      if (!user || user.role !== "employer") {
        setError("You must be logged in as an employer to view applications");
        setLoading(false);
        return;
      }

      try {
        const jobRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/jobs/${jobId}`
        );
        const jobData = await jobRes.json();
        setJob(jobData);

        const appRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/applications/job/${jobId}`
        );
        const appData = await appRes.json();
        setApplications(appData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load applications. Please try again.");
        setLoading(false);
      }
    };

    fetchJobAndApplications();
  }, [jobId, user]);

  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/applications/${selectedApplication._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: statusUpdate,
            employerNotes: notes,
          }),
        }
      );
      const updated = await res.json();
      const updatedApplications = applications.map((app) =>
        app._id === updated._id ? updated : app
      );
      setApplications(updatedApplications);
      setShowModal(false);
      setSelectedApplication(null);
    } catch (err) {
      console.error("Error updating application status:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setStatusUpdate(application.status);
    setNotes(application.employerNotes || "");
    setShowModal(true);
  };

  if (loading)
    return <div className="text-center my-5">Loading applications...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!job) return <Alert variant="warning">Job not found</Alert>;

  const filterByStatus = (statusList: string[]) =>
    applications.filter((app) => statusList.includes(app.status));

  const renderTab = (title: string, statusList: string[]) => (
    <Tab
      eventKey={title}
      title={`${title} (${filterByStatus(statusList).length})`}
    >
      {filterByStatus(statusList).length > 0 ? (
        filterByStatus(statusList).map((application) => (
          <Card key={application._id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title>{application.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {application.email} • {application.phone}
                  </Card.Subtitle>
                </div>
                <ApplicationStatusBadge status={application.status} />
              </div>
              <div className="mt-3">
                <small>Applied on: {formatDate(application.appliedDate)}</small>
                {application.lastUpdated !== application.appliedDate && (
                  <>
                    <br />
                    <small>
                      Last updated: {formatDate(application.lastUpdated)}
                    </small>
                  </>
                )}
              </div>
              <div className="d-flex gap-2 mt-3">
                <Button
                  variant="primary"
                  onClick={() => handleViewApplication(application)}
                >
                  View Application
                </Button>
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline-secondary">View Resume</Button>
                </a>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">No {title.toLowerCase()} applications</Alert>
      )}
    </Tab>
  );

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Link to="/employer/my-jobs">&larr; Back to My Jobs</Link>
        <h1 className="mt-3">Applications for {job.title}</h1>
        <p className="text-muted">
          {job.location} • {job.jobType} • Posted on{" "}
          {formatDate(job.postedDate)} • {applications.length} applications
        </p>
      </div>
      <Tabs defaultActiveKey="Pending" className="mb-4">
        {renderTab("Pending", ["Submitted", "Under Review"])}
        {renderTab("Interview", ["Interview"])}
        {renderTab("Completed", ["Accepted", "Rejected"])}
      </Tabs>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        {selectedApplication && (
          <Modal.Body>
            <h5>{selectedApplication.name}</h5>
            <p>
              {selectedApplication.email} • {selectedApplication.phone}
            </p>
            <p>Applied on {formatDate(selectedApplication.appliedDate)}</p>
            <Card className="mb-4">
              <Card.Header>Cover Letter</Card.Header>
              <Card.Body>{selectedApplication.coverLetter}</Card.Body>
            </Card>
            <a
              href={selectedApplication.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary">View Resume</Button>
            </a>
            <hr />
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Interview">Interview</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this applicant"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default JobApplications;
