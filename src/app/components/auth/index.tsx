import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobal";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const theme = useTheme();
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const { setAuthMember } = useGlobals();

  const handleUsername = (e: T) => {
    setMemberNick(e.target.value);
  };

  const handlePhone = (e: T) => {
    setMemberPhone(e.target.value);
  };

  const handlePassword = (e: T) => {
    setMemberPassword(e.target.value);
  };

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) {
      handleSignupRequest().then();
    } else if (e.key === "Enter" && loginOpen) {
      handleLoginRequest().then();
    }
  };

  const handleSignupRequest = async () => {
    try {
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
      handleSignupClose();
    } catch (err) {
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
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
      handleLoginClose();
    } catch (err) {
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  return (
    <div>
      {/* Signup Modal */}
      <Dialog
        open={signupOpen}
        onClose={handleSignupClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "480px",
            margin: theme.spacing(2),
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          },
        }}
      >
        <Box sx={{ position: "relative", padding: theme.spacing(5, 4, 4) }}>
          {/* Close Button */}
          <IconButton
            onClick={handleSignupClose}
            sx={{
              position: "absolute",
              top: theme.spacing(2),
              right: theme.spacing(2),
              color: "#86868B",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                color: "#1D1D1F",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1D1D1F",
              marginBottom: theme.spacing(4),
              textAlign: "center",
            }}
          >
            Sign Up
          </Typography>

          {/* Form Fields */}
          <Stack spacing={3} sx={{ marginBottom: theme.spacing(4) }}>
              <TextField
              label="Username"
                variant="outlined"
              value={memberNick}
                onChange={handleUsername}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: appleFont,
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontFamily: appleFont,
                  color: "#86868B",
                  "&.Mui-focused": {
                    color: "#007AFF",
                  },
                },
              }}
              />
              <TextField
              label="Phone Number"
                variant="outlined"
              value={memberPhone}
                onChange={handlePhone}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: appleFont,
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontFamily: appleFont,
                  color: "#86868B",
                  "&.Mui-focused": {
                    color: "#007AFF",
                  },
                },
              }}
              />
              <TextField
              label="Password"
              type="password"
                variant="outlined"
              value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: appleFont,
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontFamily: appleFont,
                  color: "#86868B",
                  "&.Mui-focused": {
                    color: "#007AFF",
                  },
                },
              }}
              />
          </Stack>

          {/* Signup Button */}
          <Button
            variant="contained"
            onClick={handleSignupRequest}
            fullWidth
            endIcon={<ArrowForwardIcon />}
                sx={{ 
              height: "48px",
              borderRadius: "12px",
              fontFamily: appleFont,
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "none",
              letterSpacing: "-0.01em",
              background: "#1D1D1F",
                  color: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              border: "none",
              transition: theme.transitions.create(
                ["background-color", "box-shadow", "transform"],
                {
                  duration: theme.transitions.duration.standard,
                  easing: theme.transitions.easing.easeOut,
                }
              ),
                  "&:hover": {
                background: "#2D2D2F",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
                background: "#1D1D1F",
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Dialog>

      {/* Login Modal */}
      <Dialog
        open={loginOpen}
        onClose={handleLoginClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "480px",
            margin: theme.spacing(2),
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          },
        }}
      >
        <Box sx={{ position: "relative", padding: theme.spacing(5, 4, 4) }}>
          {/* Close Button */}
          <IconButton
            onClick={handleLoginClose}
            sx={{
              position: "absolute",
              top: theme.spacing(2),
              right: theme.spacing(2),
              color: "#86868B",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                color: "#1D1D1F",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1D1D1F",
              marginBottom: theme.spacing(4),
              textAlign: "center",
            }}
          >
            Login
          </Typography>

          {/* Form Fields */}
          <Stack spacing={3} sx={{ marginBottom: theme.spacing(4) }}>
            <TextField
              label="Username"
              variant="outlined"
              value={memberNick}
              onChange={handleUsername}
              fullWidth
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: appleFont,
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontFamily: appleFont,
                  color: "#86868B",
                  "&.Mui-focused": {
                    color: "#007AFF",
                  },
                },
              }}
              />
              <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: appleFont,
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontFamily: appleFont,
                  color: "#86868B",
                  "&.Mui-focused": {
                    color: "#007AFF",
                  },
                },
              }}
            />
          </Stack>

          {/* Login Button */}
          <Button
            variant="contained"
            onClick={handleLoginRequest}
            fullWidth
            endIcon={<ArrowForwardIcon />}
            sx={{
              height: "48px",
              borderRadius: "12px",
              fontFamily: appleFont,
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "none",
              letterSpacing: "-0.01em",
              background: "#1D1D1F",
              color: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              border: "none",
              transition: theme.transitions.create(
                ["background-color", "box-shadow", "transform"],
                {
                  duration: theme.transitions.duration.standard,
                  easing: theme.transitions.easing.easeOut,
                }
              ),
              "&:hover": {
                background: "#2D2D2F",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
                background: "#1D1D1F",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Dialog>
    </div>
  );
}
