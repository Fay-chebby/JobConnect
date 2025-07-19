import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobSeeker", // default role
    companyName: "",
    industry: "",
    description: "",
    location: "",
    companySize: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare only the required fields for registration
      const dataToSend: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      // If role is employer, include extra fields
      if (formData.role === "employer") {
        dataToSend.companyName = formData.companyName;
        dataToSend.industry = formData.industry;
        dataToSend.description = formData.description;
        dataToSend.location = formData.location;
        dataToSend.companySize = formData.companySize;
      }

      await register(dataToSend);
      toast.success("Registration successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />

      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="jobSeeker">Job Seeker</option>
        <option value="employer">Employer</option>
      </select>

      {formData.role === "employer" && (
        <>
          <input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company Name"
          />
          <input
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Industry"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Company Description"
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
          />
          <input
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            placeholder="Company Size"
          />
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
