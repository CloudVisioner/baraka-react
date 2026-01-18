import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Settings } from "./Settings";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobal";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import "../../../css/userPage.css";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();
  const theme = useTheme();

  if (!authMember) history.push("/");

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F5F5F7",
        paddingTop: { xs: theme.spacing(4), md: theme.spacing(6) },
        paddingBottom: theme.spacing(8),
      }}
    >
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box
          sx={{
            marginBottom: { xs: theme.spacing(4), md: theme.spacing(6) },
          }}
        >
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "32px", md: "48px" },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1D1D1F",
              marginBottom: theme.spacing(1),
            }}
          >
            My Profile
          </Typography>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "15px", md: "17px" },
              fontWeight: 400,
              color: "#1D1D1F",
              letterSpacing: "-0.01em",
              opacity: 0.8,
            }}
          >
            Manage your account settings and profile information
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: theme.spacing(4), lg: theme.spacing(5) },
          }}
        >
          {/* Main Content - Settings Form */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ padding: theme.spacing(5) }}>
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "24px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "#1D1D1F",
                    marginBottom: theme.spacing(4),
                  }}
                >
                  Account Settings
                </Typography>
                <Settings />
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar - Profile Card */}
          <Box
            sx={{
              width: { xs: "100%", lg: "380px" },
              flexShrink: 0,
            }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                backgroundColor: "#FFFFFF",
                padding: theme.spacing(4),
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                position: "sticky",
                top: theme.spacing(4),
                overflow: "hidden",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                {/* Avatar */}
                <Box sx={{ position: "relative", marginBottom: theme.spacing(2) }}>
                  <Avatar
                    src={
                      authMember?.memberImage
                        ? `${serverApi}/uploads/${authMember.memberImage}`
                        : "/icons/default-user.svg"
                    }
                    sx={{
                      width: { xs: 100, md: 120 },
                      height: { xs: 100, md: 120 },
                      border: "4px solid #F5F5F7",
                    }}
                  />
                  <Avatar
                    src={
                      authMember?.memberType === MemberType.RESTAURANT
                        ? "/icons/restaurant.svg"
                        : "/icons/user-badge.svg"
                    }
                    sx={{
                      width: 36,
                      height: 36,
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      border: "3px solid #FFFFFF",
                      backgroundColor: "#F5F5F7",
                    }}
                  />
                </Box>

                {/* Name */}
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "24px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "#1D1D1F",
                    marginBottom: theme.spacing(0.5),
                  }}
                >
                  {authMember?.memberNick || "Guest"}
                </Typography>

                {/* Member Type */}
                <Typography
                  sx={{
                    fontFamily: appleFont,
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    textTransform: "capitalize",
                    marginBottom: theme.spacing(3),
                    opacity: 0.8,
                  }}
                >
                  {authMember?.memberType || "Member"}
                </Typography>

                <Divider sx={{ width: "100%", marginBottom: theme.spacing(3) }} />

                {/* Address */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    gap: theme.spacing(1),
                    marginBottom: theme.spacing(3),
                  }}
                >
                  <LocationOnIcon
                    sx={{
                      fontSize: "18px",
                      color: "#1D1D1F",
                      opacity: 0.7,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#1D1D1F",
                      lineHeight: 1.5,
                      textAlign: "center",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                    }}
                  >
                    {authMember?.memberAddress || "No address provided"}
                  </Typography>
                </Box>

                {/* Social Media Icons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: theme.spacing(2),
                    marginBottom: theme.spacing(3),
                    justifyContent: "center",
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#F5F5F7",
                      "&:hover": {
                        backgroundColor: "#E5E5E7",
                      },
                    }}
                  >
                    <FacebookIcon sx={{ fontSize: "20px", color: "#1D1D1F" }} />
                  </IconButton>
                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#F5F5F7",
                      "&:hover": {
                        backgroundColor: "#E5E5E7",
                      },
                    }}
                  >
                    <InstagramIcon sx={{ fontSize: "20px", color: "#1D1D1F" }} />
                  </IconButton>
                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#F5F5F7",
                      "&:hover": {
                        backgroundColor: "#E5E5E7",
                      },
                    }}
                  >
                    <TelegramIcon sx={{ fontSize: "20px", color: "#1D1D1F" }} />
                  </IconButton>
                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#F5F5F7",
                      "&:hover": {
                        backgroundColor: "#E5E5E7",
                      },
                    }}
                  >
                    <YouTubeIcon sx={{ fontSize: "20px", color: "#1D1D1F" }} />
                  </IconButton>
                </Box>

                {/* Description */}
                {authMember?.memberDesc && (
                  <>
                    <Divider sx={{ width: "100%", marginBottom: theme.spacing(3) }} />
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#1D1D1F",
                        lineHeight: 1.6,
                        width: "100%",
                        maxWidth: "100%",
                        textAlign: "center",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        overflow: "hidden",
                        boxSizing: "border-box",
                      }}
                    >
                      {authMember.memberDesc}
                    </Typography>
                  </>
                )}
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
