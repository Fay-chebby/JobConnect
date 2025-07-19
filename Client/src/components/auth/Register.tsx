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
    role: "jobSeeker",
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

    const dataToSend: any = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "employer") {
      dataToSend.companyName = formData.companyName;
      dataToSend.industry = formData.industry;
      dataToSend.description = formData.description;
      dataToSend.location = formData.location;
      dataToSend.companySize = formData.companySize;
    }

    try {
      await register(dataToSend);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Create Account</h2>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border border-gray-300 p-2 rounded-lg"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
        >
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
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
            <input
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Industry"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Company Description"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            >
              <option value="">Select Company Size</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
