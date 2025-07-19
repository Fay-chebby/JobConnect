import React from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <Container className="py-5 text-center">
      <Alert variant="danger">
        <Alert.Heading>Access Denied</Alert.Heading>
        <p>
          Sorry, you don't have permission to access this page. This area may be
          restricted to certain user roles.
        </p>
        <hr />
        <div className="d-flex justify-content-center">
          <Link to="/dashboard">
            <Button variant="outline-primary" className="me-3">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="primary">Home Page</Button>
          </Link>
        </div>
      </Alert>
    </Container>
  );
};

export default Unauthorized;
