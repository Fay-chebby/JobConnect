import React, { useState, useEffect, FormEvent } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import JobCard from "@/components/jobs/JobCard";
import JobFilter from "@/components/jobs/JobFilter";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  postedDate: string;
  employerId: string;
}

interface Filters {
  jobType?: string[];
  location?: string;
  salary?: string;
}

const BrowseJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<Filters>({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, activeFilters, jobs]);

  const applyFilters = () => {
    let results = [...jobs];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term)
      );
    }

    if (activeFilters.jobType && activeFilters.jobType.length > 0) {
      results = results.filter((job) =>
        activeFilters.jobType!.includes(job.jobType)
      );
    }

    if (activeFilters.location) {
      const locationTerm = activeFilters.location.toLowerCase();
      results = results.filter((job) =>
        job.location.toLowerCase().includes(locationTerm)
      );
    }

    if (activeFilters.salary) {
      results = results.filter((job) => {
        const salaryMatch = job.salary.match(/\$?([\d,]+)/g);
        if (!salaryMatch) return false;

        const nums = salaryMatch.map((s) =>
          parseInt(s.replace(/[^0-9]/g, ""), 10)
        );

        const min = Math.min(...nums);
        switch (activeFilters.salary) {
          case "0-50000":
            return min < 50000;
          case "50000-80000":
            return min >= 50000 && min < 80000;
          case "80000-100000":
            return min >= 80000 && min < 100000;
          case "100000+":
            return min >= 100000;
          default:
            return true;
        }
      });
    }

    setFilteredJobs(results);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  const handleFilterChange = (filters: Filters) => {
    setActiveFilters(filters);
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" /> Loading jobs...
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Find Your Perfect Job</h1>

      <Row className="mb-4">
        <Col>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                placeholder="Search jobs by title, company, or keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <i className="bi bi-search"></i> Search
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <JobFilter onFilterChange={handleFilterChange} />
        </Col>
        <Col lg={9}>
          {filteredJobs.length > 0 ? (
            <>
              <p className="mb-3">{filteredJobs.length} jobs found</p>
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </>
          ) : (
            <Alert variant="info">
              No jobs match your search criteria. Try adjusting your filters.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BrowseJobs;
