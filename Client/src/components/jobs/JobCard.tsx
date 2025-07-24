import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship" | string;
  description: string;
  postedDate: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getBadgeVariant = (type: string): string => {
    switch (type) {
      case "Full-time":
        return "primary";
      case "Part-time":
        return "success";
      case "Contract":
        return "warning";
      case "Internship":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <Card.Title>{job.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {job.company}
            </Card.Subtitle>
          </div>
          <Badge bg={getBadgeVariant(job.jobType)}>{job.jobType}</Badge>
        </div>

        <Card.Text className="mt-3">
          <i className="bi bi-geo-alt me-2"></i>
          {job.location}
        </Card.Text>

        <Card.Text className="text-truncate">{job.description}</Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Posted on {formatDate(job.postedDate)}
          </small>
          <Link to={`/jobs/${job._id}`}>
            <Button variant="outline-primary">View Details</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default JobCard;
