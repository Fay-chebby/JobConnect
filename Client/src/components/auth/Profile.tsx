import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Container, Row, Col, Form, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';
import { JobSeekerProfile, EmployerProfile, Education, Experience, ProfileUpdateData } from '@/types';

const API_URL = 'http://localhost:5000/api';

const Profile = () => {
  const { user, token, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<JobSeekerProfile | EmployerProfile | null>(null);

  // Load user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !token) return;

      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfile(response.data.data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, token]);

  // Update profile function
  const updateProfile = async (formData: ProfileUpdateData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const endpoint = user?.role === 'jobSeeker' 
        ? `${API_URL}/jobseekers/${profile?._id}` 
        : `${API_URL}/employers/${profile?._id}`;
      
      await axios.put(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  // Job Seeker Profile
  if (user.role === 'jobSeeker') {
    const jobSeekerProfile = profile as JobSeekerProfile;
    
    return (
      <Container className="py-5">
        <h1 className="mb-4">My Profile</h1>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={3} className="border-end">
                <div className="text-center">
                  <div className="mb-3">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto" style={{ width: '120px', height: '120px' }}>
                      <span className="display-4 text-muted">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <h5>{user.name}</h5>
                  <p className="text-muted mb-1">Job Seeker</p>
                  <p className="text-muted">{jobSeekerProfile.location || 'Location not set'}</p>
                </div>
              </Col>
              <Col md={9}>
                <Tabs defaultActiveKey="basic-info" className="mb-3">
                  <Tab eventKey="basic-info" title="Basic Info">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" value={user.name} readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={user.email} readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control 
                          type="text" 
                          defaultValue={jobSeekerProfile.location || ''} 
                          placeholder="Your location"
                          onChange={(e) => setProfile({...jobSeekerProfile, location: e.target.value})}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          defaultValue={jobSeekerProfile.bio || ''} 
                          placeholder="Tell employers about yourself"
                          onChange={(e) => setProfile({...jobSeekerProfile, bio: e.target.value})}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Website/Portfolio</Form.Label>
                        <Form.Control 
                          type="url" 
                          defaultValue={jobSeekerProfile.website || ''} 
                          placeholder="https://your-portfolio-site.com"
                          onChange={(e) => setProfile({...jobSeekerProfile, website: e.target.value})}
                        />
                      </Form.Group>
                      <Button 
                        variant="primary" 
                        onClick={() => updateProfile({
                          location: jobSeekerProfile.location,
                          bio: jobSeekerProfile.bio,
                          website: jobSeekerProfile.website
                        })}
                      >
                        Save Changes
                      </Button>
                    </Form>
                  </Tab>
                  <Tab eventKey="skills" title="Skills">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Skills</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          defaultValue={jobSeekerProfile.skills ? jobSeekerProfile.skills.join(', ') : ''}
                          placeholder="Java, React, SQL, Project Management"
                        />
                        <Form.Text className="text-muted">
                          Enter your skills separated by commas
                        </Form.Text>
                      </Form.Group>
                      <Button 
                        variant="primary" 
                        onClick={() => updateProfile({
                          skills: jobSeekerProfile.skills
                        })}
                      >
                        Save Skills
                      </Button>
                    </Form>
                  </Tab>
                  <Tab eventKey="experience" title="Experience">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Work Experience</h5>
                      <Button variant="outline-primary" size="sm">+ Add Experience</Button>
                    </div>
                    
                    {jobSeekerProfile.experience && jobSeekerProfile.experience.length > 0 ? (
                      jobSeekerProfile.experience.map((exp: Experience, index: number) => (
                        <Card key={index} className="mb-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between">
                              <div>
                                <h6 className="mb-1">{exp.title}</h6>
                                <p className="mb-1 text-muted">{exp.company} - {exp.location}</p>
                                <p className="mb-1 small text-muted">
                                  {new Date(exp.fromDate).toLocaleDateString()} - 
                                  {exp.current ? 'Present' : new Date(exp.toDate || '').toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <Button variant="link" className="text-danger p-0">
                                  Remove
                                </Button>
                              </div>
                            </div>
                            <p className="mt-2 mb-0 small">{exp.description}</p>
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted">No work experience added yet.</p>
                    )}
                  </Tab>
                  <Tab eventKey="education" title="Education">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Education</h5>
                      <Button variant="outline-primary" size="sm">+ Add Education</Button>
                    </div>
                    
                    {jobSeekerProfile.education && jobSeekerProfile.education.length > 0 ? (
                      jobSeekerProfile.education.map((edu: Education, index: number) => (
                        <Card key={index} className="mb-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between">
                              <div>
                                <h6 className="mb-1">{edu.degree}</h6>
                                <p className="mb-1 text-muted">{edu.institution}</p>
                                <p className="mb-1 small text-muted">
                                  {new Date(edu.fromDate).toLocaleDateString()} - 
                                  {edu.current ? 'Present' : new Date(edu.toDate || '').toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <Button variant="link" className="text-danger p-0">
                                  Remove
                                </Button>
                              </div>
                            </div>
                            <p className="mt-2 mb-0 small">{edu.description}</p>
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted">No education history added yet.</p>
                    )}
                  </Tab>
                  <Tab eventKey="resume" title="Resume">
                    <div className="mb-4">
                      <h5 className="mb-3">Upload Resume</h5>
                      <Form.Group controlId="resumeFile" className="mb-3">
                        <Form.Label>Upload your resume (PDF, DOC, DOCX)</Form.Label>
                        <Form.Control type="file" />
                      </Form.Group>
                      <Button variant="primary">Upload</Button>
                    </div>
                    
                    {jobSeekerProfile.resume ? (
                      <div className="mt-4">
                        <h5 className="mb-3">Current Resume</h5>
                        <Card className="p-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <i className="fas fa-file-pdf fa-2x text-danger"></i>
                              </div>
                              <div>
                                <h6 className="mb-0">My Resume.pdf</h6>
                                <small className="text-muted">Uploaded on: {new Date().toLocaleDateString()}</small>
                              </div>
                            </div>
                            <div>
                              <Button variant="outline-secondary" size="sm" className="me-2">
                                View
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ) : (
                      <Alert variant="info" className="mt-3">
                        You haven't uploaded a resume yet. Uploading a resume will help employers find you more easily.
                      </Alert>
                    )}
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Employer Profile
  const employerProfile = profile as EmployerProfile;
  return (
    <Container className="py-5">
      <h1 className="mb-4">Company Profile</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={3} className="border-end">
              <div className="text-center">
                <div className="mb-3">
                  <div className="rounded bg-light d-flex align-items-center justify-content-center mx-auto" style={{ width: '120px', height: '120px' }}>
                    {employerProfile.logo ? (
                      <img 
                        src={employerProfile.logo} 
                        alt={employerProfile.companyName} 
                        className="img-fluid rounded"
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                    ) : (
                      <span className="display-4 text-muted">
                        {employerProfile.companyName?.charAt(0) || user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <h5>{employerProfile.companyName}</h5>
                <p className="text-muted mb-1">Employer</p>
                <p className="text-muted">{employerProfile.location}</p>
                <Form.Group controlId="logoFile" className="mb-3 mt-3">
                  <Form.Label>Update Logo</Form.Label>
                  <Form.Control type="file" size="sm" />
                </Form.Group>
                <Button variant="outline-primary" size="sm">Upload Logo</Button>
              </div>
            </Col>
            <Col md={9}>
              <Tabs defaultActiveKey="company-info" className="mb-3">
                <Tab eventKey="company-info" title="Company Info">
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Company Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            defaultValue={employerProfile.companyName || ''} 
                            onChange={(e) => setProfile({...employerProfile, companyName: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Industry</Form.Label>
                          <Form.Control 
                            type="text" 
                            defaultValue={employerProfile.industry || ''} 
                            onChange={(e) => setProfile({...employerProfile, industry: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location</Form.Label>
                          <Form.Control 
                            type="text" 
                            defaultValue={employerProfile.location || ''} 
                            onChange={(e) => setProfile({...employerProfile, location: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Company Size</Form.Label>
                          <Form.Select
                            defaultValue={employerProfile.companySize || ''}
                            onChange={(e) => setProfile({...employerProfile, companySize: e.target.value})}
                          >
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="501-1000">501-1000 employees</option>
                            <option value="1000+">1000+ employees</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Website</Form.Label>
                      <Form.Control 
                        type="url" 
                        defaultValue={employerProfile.website || ''} 
                        placeholder="https://your-company-website.com"
                        onChange={(e) => setProfile({...employerProfile, website: e.target.value})}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Company Description</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4}
                        defaultValue={employerProfile.description || ''} 
                        placeholder="Describe your company, culture, mission and values"
                        onChange={(e) => setProfile({...employerProfile, description: e.target.value})}
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      onClick={() => updateProfile({
                        companyName: employerProfile.companyName,
                        industry: employerProfile.industry,
                        location: employerProfile.location,
                        companySize: employerProfile.companySize,
                        website: employerProfile.website,
                        description: employerProfile.description
                      })}
                    >
                      Save Changes
                    </Button>
                  </Form>
                </Tab>
                <Tab eventKey="jobs" title="Posted Jobs">
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Job Listings</h5>
                    <Button variant="primary" size="sm">+ Post New Job</Button>
                  </div>
                  
                  {/* This section would be populated with job listings fetched from the API */}
                  <Alert variant="info">
                    You don't have any active job postings. Click "Post New Job" to create your first job listing.
                  </Alert>
                </Tab>
                <Tab eventKey="applications" title="Applications">
                  <div className="mb-3">
                    <h5>Recent Applications</h5>
                  </div>
                  
                  {/* This section would be populated with job applications fetched from the API */}
                  <Alert variant="info">
                    No applications to show. Applications to your jobs will appear here.
                  </Alert>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;