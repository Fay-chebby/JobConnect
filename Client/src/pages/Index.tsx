import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Navigation from "../layout/Navigation";

const Index: React.FC = () => {
  return (
    <div>
      <Navigation />

      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Find Your Dream Job Today
              </h1>
              <p className="lead mb-4">
                Connect with top employers and discover opportunities that match
                your skills and career goals.
              </p>
              <div className="d-grid gap-2 d-md-flex">
                <Button
                  as={Link as any}
                  to="/register"
                  variant="light"
                  size="lg"
                  className="me-md-2 px-4"
                >
                  Sign Up
                </Button>
                <Button
                  as={Link as any}
                  to="/jobs"
                  variant="outline-light"
                  size="lg"
                  className="px-4"
                >
                  Browse Jobs
                </Button>
              </div>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0 text-center">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Job Search"
                className="img-fluid rounded"
                style={{ maxHeight: "400px" }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Search Section */}
      <Container className="py-5">
        <Card className="shadow border-0 mb-5" style={{ marginTop: "-25px" }}>
          <Card.Body className="p-4">
            <Form>
              <Row>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Keywords</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Job title, skills or keywords"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="City, state or remote"
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button variant="primary" type="submit" className="w-100">
                    Search Jobs
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Featured Categories */}
        <h2 className="mb-4">Popular Job Categories</h2>
        <Row>
          {[
            "Technology",
            "Healthcare",
            "Finance",
            "Education",
            "Marketing",
            "Design",
          ].map((category, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-light rounded p-3 me-3">
                    <i className="bi bi-briefcase fs-4"></i>
                  </div>
                  <div>
                    <Card.Title>{category}</Card.Title>
                    <Card.Text className="text-muted">
                      {Math.floor(Math.random() * 100) + 20} jobs available
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* How it Works */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row className="text-center">
            {[
              {
                step: 1,
                title: "Create an Account",
                description:
                  "Sign up as a job seeker or employer to get started.",
              },
              {
                step: 2,
                title: "Complete Your Profile",
                description:
                  "Add your resume, skills, and experience to stand out.",
              },
              {
                step: 3,
                title: "Apply for Jobs",
                description:
                  "Find and apply to jobs that match your skills and interests.",
              },
            ].map(({ step, title, description }) => (
              <Col md={4} className="mb-4" key={step}>
                <div
                  className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  style={{ width: "100px", height: "100px" }}
                >
                  <span className="display-4 fw-bold text-primary">{step}</span>
                </div>
                <h4 className="mt-4">{title}</h4>
                <p className="text-muted">{description}</p>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button as={Link as any} to="/register" variant="primary" size="lg">
              Get Started
            </Button>
          </div>
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white pt-5 pb-4">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h5>Job Portal</h5>
              <p>Connecting talent with opportunities worldwide.</p>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h5>For Job Seekers</h5>
              <ul className="list-unstyled">
                <li>
                  <Link
                    to="/jobs"
                    className="text-white-50 text-decoration-none"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-white-50 text-decoration-none"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-white-50 text-decoration-none"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h5>For Employers</h5>
              <ul className="list-unstyled">
                <li>
                  <Link
                    to="/post-job"
                    className="text-white-50 text-decoration-none"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-white-50 text-decoration-none"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-white-50 text-decoration-none"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Subscribe to Job Alerts</h5>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Your email"
                  aria-label="Your email"
                />
                <Button variant="primary" id="button-addon2">
                  Subscribe
                </Button>
              </InputGroup>
              <p className="small text-white-50">
                Get the latest job listings and career tips delivered to your
                inbox.
              </p>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="text-center text-white-50">
            <p>
              &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Index;
