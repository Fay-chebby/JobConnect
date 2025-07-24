import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext"; // adjust path if needed

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  dateApplied: string;
}

const MyApplications: React.FC = () => {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !token) {
        setError("Please log in to view your applications.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications(response.data.applications || []);
      } catch (err: any) {
        console.error("Failed to fetch applications:", err);
        setError("Error fetching your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, token]);

  if (loading) return <p>Loading your applications...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li
              key={app.id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <h3 className="font-bold">{app.jobTitle}</h3>
              <p>Company: {app.company}</p>
              <p>Status: {app.status}</p>
              <p>
                Applied On: {new Date(app.dateApplied).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyApplications;
