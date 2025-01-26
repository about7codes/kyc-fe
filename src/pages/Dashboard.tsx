import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { BE_ENDPOINT } from "../utils/auth";

function Dashboard() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: any) => state.auth);

  const [kycStatus, setKycStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const persistedState = JSON.parse(
      localStorage.getItem("persist:root") || "{}"
    );
    const authState = persistedState?.auth
      ? JSON.parse(persistedState.auth)
      : null;

    if (authState?.token && authState?.user) {
      dispatch(login({ token: authState.token, user: authState.user }));
    }

    const fetchUser = async (token: string) => {
      try {
        const res = await fetch(`${BE_ENDPOINT}/api/auth/me`, {
          headers: { Authorization: "Bearer " + token || "" },
        });
        const data = await res.json();
        if (res.ok) {
          setKycStatus(data.data.kycStatus);
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser(token);
  }, [dispatch]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name || "User"}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your KYC Status: <strong>{kycStatus || "N/A"}</strong>
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate("/kyc")}
        >
          Submit KYC
        </Button>
      </Box>
    </Container>
  );
}

export default Dashboard;
