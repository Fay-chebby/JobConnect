import React, { useState, FC, ChangeEvent, FormEvent } from "react";
import { Form, Button, Collapse, Card } from "react-bootstrap";

interface JobFilters {
  jobType: string[];
  location: string;
  salary: string;
  experience: string;
}

interface JobFilterProps {
  onFilterChange: (filters: JobFilters) => void;
}

const JobFilter: FC<JobFilterProps> = ({ onFilterChange }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [filters, setFilters] = useState<JobFilters>({
    jobType: [],
    location: "",
    salary: "",
    experience: "",
  });

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const updatedJobTypes = checked
        ? [...prev.jobType, value]
        : prev.jobType.filter((type) => type !== value);

      return { ...prev, jobType: updatedJobTypes };
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters: JobFilters = {
      jobType: [],
      location: "",
      salary: "",
      experience: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Filter Jobs</h5>
          <Button
            onClick={() => setOpen(!open)}
            variant="link"
            className="text-decoration-none p-0"
          >
            {open ? "Hide" : "Show"}
          </Button>
        </div>
      </Card.Header>

      <Collapse in={open}>
        <div>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Job Type</Form.Label>
                <div>
                  {["Full-time", "Part-time", "Contract", "Internship"].map(
                    (type) => (
                      <Form.Check
                        key={type}
                        type="checkbox"
                        id={`jobType-${type}`}
                        label={type}
                        value={type}
                        checked={filters.jobType.includes(type)}
                        onChange={handleCheckboxChange}
                        className="mb-2"
                      />
                    )
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="City, State or Remote"
                  value={filters.location}
                  // onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Salary Range</Form.Label>
                <Form.Select
                  name="salary"
                  value={filters.salary}
                  onChange={handleInputChange}
                >
                  <option value="">All Ranges</option>
                  <option value="0-50000">Under $50,000</option>
                  <option value="50000-80000">$50,000 - $80,000</option>
                  <option value="80000-100000">$80,000 - $100,000</option>
                  <option value="100000+">$100,000+</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Experience Level</Form.Label>
                <Form.Select
                  name="experience"
                  value={filters.experience}
                  onChange={handleInputChange}
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive Level</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button type="submit" variant="primary" className="flex-grow-1">
                  Apply Filters
                </Button>
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </Form>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
};

export default JobFilter;
