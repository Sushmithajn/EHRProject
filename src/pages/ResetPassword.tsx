import React, { useState, useEffect } from "react";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("${process.env.REACT_APP_API_BASE_URL}/api/doctor/reset-password", {
        token,
        newPassword,
      });

      setMessage(response.data.message);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Something went wrong.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ display: "block", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ display: "block", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <button onClick={handleReset} style={{ padding: "0.5rem 1rem" }}>
        Reset Password
      </button>
      {message && <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
