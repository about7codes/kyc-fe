import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as clearUser } from "../redux/slices/authSlice";

const Navbar: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  const handleTitleClick = () => {
    if (user) {
      navigate(user.role === "Admin" ? "/admin" : "/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={handleTitleClick}
        >
          KYC App
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              {user.role === "Admin" && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin Panel
                </Button>
              )}
              <Button color="inherit" component={Link} to="/kyc">
                KYC Form
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          {!user && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
