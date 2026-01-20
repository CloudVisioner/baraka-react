import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  useTheme,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobal";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

export default function AuthPage() {
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const { setAuthMember } = useGlobals();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    if (mode === "signup") {
      setIsLogin(false);
    }
  }, [location.search]);

  const handleUsername = (e: T) => {
    setMemberNick(e.target.value);
  };

  const handlePhone = (e: T) => {
    setMemberPhone(e.target.value);
  };

  const handlePassword = (e: T) => {
    setMemberPassword(e.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isLogin) {
        handleLoginRequest();
      } else {
        handleSignupRequest();
      }
    }
  };

  const handleSignupRequest = async () => {
    try {
      setIsLoading(true);
      const isFullfill =
        memberNick !== "" && memberPassword !== "" && memberPhone !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.signup(signupInput);

      setAuthMember(result);
      setMemberNick("");
      setMemberPhone("");
      setMemberPassword("");
      await sweetTopSuccessAlert("Account created successfully!", 1000);
      history.push("/");
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRequest = async () => {
    try {
      setIsLoading(true);
      const isFullfill = memberNick !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);

      setAuthMember(result);
      setMemberNick("");
      setMemberPassword("");
      await sweetTopSuccessAlert("Welcome back!", 1000);
      history.push("/");
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: theme.spacing(3), sm: theme.spacing(4) },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            top: "-300px",
            right: "-300px",
            animation: "float 20s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": {
                transform: "translate(0, 0) rotate(0deg)",
              },
              "50%": {
                transform: "translate(-50px, -50px) rotate(180deg)",
              },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            bottom: "-200px",
            left: "-200px",
            animation: "float 15s ease-in-out infinite reverse",
          }}
        />
      </Box>

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* Back Button */}
        <IconButton
          onClick={() => history.push("/")}
          sx={{
            position: "absolute",
            top: { xs: theme.spacing(-2), sm: theme.spacing(-3) },
            left: { xs: theme.spacing(-1), sm: 0 },
            color: "#FFFFFF",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Main Card */}
        <Fade in={true} timeout={600}>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "32px",
              padding: { xs: theme.spacing(4), sm: theme.spacing(6) },
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: "center", marginBottom: theme.spacing(5) }}>
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: { xs: "32px", sm: "40px" },
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#1D1D1F",
                  marginBottom: theme.spacing(1),
                }}
              >
                {isLogin ? "Welcome Back" : "Create Account"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "17px",
                  fontWeight: 400,
                  color: "#86868B",
                  letterSpacing: "-0.01em",
                }}
              >
                {isLogin
                  ? "Sign in to continue to Baraka Books"
                  : "Join Baraka Books and start your reading journey"}
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" sx={{ marginBottom: theme.spacing(4) }}>
              {/* Username */}
              <TextField
                fullWidth
                label="Username"
                value={memberNick}
                onChange={handleUsername}
                onKeyDown={handleKeyDown}
                sx={{
                  marginBottom: theme.spacing(3),
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    fontFamily: appleFont,
                    fontSize: "17px",
                    backgroundColor: "#F5F5F7",
                    transition: "all 0.3s ease",
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                      borderWidth: "1.5px",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 122, 255, 0.3)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#007AFF",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: appleFont,
                    color: "#86868B",
                    fontSize: "17px",
                    "&.Mui-focused": {
                      color: "#007AFF",
                    },
                  },
                }}
              />

              {/* Phone (only for signup) */}
              {!isLogin && (
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={memberPhone}
                  onChange={handlePhone}
                  onKeyDown={handleKeyDown}
                  sx={{
                    marginBottom: theme.spacing(3),
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      fontFamily: appleFont,
                      fontSize: "17px",
                      backgroundColor: "#F5F5F7",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.1)",
                        borderWidth: "1.5px",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 122, 255, 0.3)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.1)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#007AFF",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: appleFont,
                      color: "#86868B",
                      fontSize: "17px",
                      "&.Mui-focused": {
                        color: "#007AFF",
                      },
                    },
                  }}
                />
              )}

              {/* Password */}
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handleKeyDown}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        sx={{
                          color: "#86868B",
                          "&:hover": {
                            color: "#007AFF",
                          },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginBottom: theme.spacing(4),
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    fontFamily: appleFont,
                    fontSize: "17px",
                    backgroundColor: "#F5F5F7",
                    transition: "all 0.3s ease",
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                      borderWidth: "1.5px",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 122, 255, 0.3)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#007AFF",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: appleFont,
                    color: "#86868B",
                    fontSize: "17px",
                    "&.Mui-focused": {
                      color: "#007AFF",
                    },
                  },
                }}
              />

              {/* Submit Button */}
              <Button
                fullWidth
                variant="contained"
                onClick={isLogin ? handleLoginRequest : handleSignupRequest}
                disabled={isLoading}
                sx={{
                  height: "56px",
                  borderRadius: "16px",
                  fontFamily: appleFont,
                  fontSize: "17px",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: "-0.01em",
                  background: isLogin
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #007AFF 0%, #0051D5 100%)",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 16px rgba(0, 122, 255, 0.4)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0, 122, 255, 0.5)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "&:disabled": {
                    opacity: 0.6,
                  },
                }}
              >
                {isLoading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </Box>

            {/* Toggle Mode */}
            <Box
              sx={{
                textAlign: "center",
                paddingTop: theme.spacing(3),
                borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: appleFont,
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#86868B",
                  marginBottom: theme.spacing(1),
                }}
              >
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Typography>
              <Button
                onClick={toggleMode}
                sx={{
                  fontFamily: appleFont,
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#007AFF",
                  textTransform: "none",
                  letterSpacing: "-0.01em",
                  padding: theme.spacing(1, 2),
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 122, 255, 0.1)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
