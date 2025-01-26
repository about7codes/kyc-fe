import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { BE_ENDPOINT } from "../utils/auth";

function AdminDashboard() {
  const { token } = useSelector((state: any) => state.auth);

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BE_ENDPOINT}/api/admin/users`, {
          headers: { Authorization: "Bearer " + token || "" },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.data);
          setStats(data.stats);
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const updateStatus = async (userId: any, status: string) => {
    try {
      const res = await fetch(
        `${BE_ENDPOINT}/api/kyc/status/${encodeURIComponent(userId)}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        window.location.reload();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Total Users: {stats.totalUsers}, Approved: {stats.approved},
            Rejected: {stats.rejected}, Pending: {stats.pending}
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>KYC Status</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.kycDetails.status}</TableCell>
                  <TableCell>
                    {user?.kycDetails?.documentPath ? (
                      <img
                        src={`${BE_ENDPOINT}/${user.kycDetails.documentPath}`}
                        alt={`${user.name}'s image`}
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                    ) : (
                      <Typography>No Image</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mr: 1 }}
                      onClick={() => updateStatus(user._id, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => updateStatus(user._id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default AdminDashboard;
