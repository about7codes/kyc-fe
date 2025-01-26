// src/pages/KYCForm.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Input,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BE_ENDPOINT } from "../utils/auth";

const KYCForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!document) {
      alert("Please upload a document.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("document", document);

    try {
      const response = await fetch(`${BE_ENDPOINT}/api/kyc/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit KYC");
      }

      alert("KYC submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to submit KYC. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h4" mb={2}>
        Submit KYC
      </Typography>
      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Input
        type="file"
        inputProps={{ accept: ".pdf,.jpg,.png" }}
        onChange={handleFileChange}
        sx={{ mb: 2 }}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      )}
    </Box>
  );
};

export default KYCForm;
