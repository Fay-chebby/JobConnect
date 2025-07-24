import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  skills: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  applicationDeadline?: string;
  status: string;
  createdAt: string;
  employer?: {
    name: string;
    _id: string;
  };
}

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get<Job>(
          `http://localhost:5000/api/jobs/${id}`
        );
        setJob(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load job details.");
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !job) return <p>{error || "Job not found"}</p>;

  return (
    <div className="container py-4">
      <h2>{job.title}</h2>
      <p className="text-muted">
        {job.location} | {job.jobType} | {job.experienceLevel}
      </p>
      <p>
        Status: <strong>{job.status}</strong>
      </p>
      <p>Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>

      {job.salary && (
        <p>
          Salary: {job.salary.min} - {job.salary.max} {job.salary.currency} (
          {job.salary.period})
        </p>
      )}

      <hr />

      <h4>Description</h4>
      <p>{job.description}</p>

      {job.skills?.length > 0 && (
        <>
          <h4>Skills Required</h4>
          <ul>
            {job.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </>
      )}

      {job.responsibilities?.length > 0 && (
        <>
          <h4>Responsibilities</h4>
          <ul>
            {job.responsibilities.map((res, i) => (
              <li key={i}>{res}</li>
            ))}
          </ul>
        </>
      )}

      {job.qualifications?.length > 0 && (
        <>
          <h4>Qualifications</h4>
          <ul>
            {job.qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </>
      )}

      {job.benefits?.length > 0 && (
        <>
          <h4>Benefits</h4>
          <ul>
            {job.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </>
      )}

      {job.applicationDeadline && (
        <p>
          <strong>Apply Before:</strong>{" "}
          {new Date(job.applicationDeadline).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default JobDetails;
