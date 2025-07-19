import React from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LinkContainer } from "react-router-bootstrap";

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Job Portal</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/jobs">
              <Nav.Link>Browse Jobs</Nav.Link>
            </LinkContainer>

            {isAuthenticated && user?.role === "employer" && (
              <>
                <LinkContainer to="/post-job">
                  <Nav.Link>Post a Job</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/manage-jobs">
                  <Nav.Link>Manage Jobs</Nav.Link>
                </LinkContainer>
              </>
            )}

            {isAuthenticated && user?.role === "jobSeeker" && (
              <LinkContainer to="/applications">
                <Nav.Link>My Applications</Nav.Link>
              </LinkContainer>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <NavDropdown
                title={user?.name || "Account"}
                id="basic-nav-dropdown"
                align="end"
              >
                <LinkContainer to="/dashboard">
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Button variant="outline-light" className="me-2">
                    Login
                  </Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="primary">Register</Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
