import { Box, Container, Card, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

/** REDUX SLICE & SELECTOR */
const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));

export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#F5F5F7",
        padding: { xs: "80px 24px", md: "120px 0" },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            marginBottom: { xs: "48px", md: "64px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1D1D1F",
              textAlign: "center",
            }}
          >
            Active Users
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: "24px",
            width: "100%",
          }}
        >
          {topUsers.length !== 0 ? (
            topUsers.map((member: Member) => {
              const imagePath = member.memberImage
                ? `${serverApi}/uploads/${member.memberImage}`
                : "/icons/default-user.svg";

              return (
                <Card
                  key={member._id}
                  elevation={0}
                  sx={{
                    borderRadius: "32px",
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.4s cubic-bezier(0.2, 1, 0.2, 1), box-shadow 0.4s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  {/* Image Section */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1",
                      overflow: "hidden",
                      backgroundColor: "#F5F5F7",
                    }}
                  >
                    <img
                      src={imagePath}
                      alt={member.memberNick}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  {/* Content Section */}
                  <Box
                    sx={{
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "#1D1D1F",
                        lineHeight: 1.3,
                      }}
                    >
                      {member.memberNick}
                    </Typography>
                    {member.memberPoints && (
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "0.875rem",
                          fontWeight: 400,
                          color: "#6E6E73",
                          marginTop: "8px",
                        }}
                      >
                        {member.memberPoints} points
                      </Typography>
                    )}
                  </Box>
                </Card>
              );
            })
          ) : (
            <Box
              sx={{
                gridColumn: { xs: "1 / -1", sm: "1 / -1", md: "1 / -1" },
                width: "100%",
                minHeight: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: appleFont,
                fontSize: "1.375rem",
                fontWeight: 500,
                color: "#86868B",
                letterSpacing: "-0.02em",
                textAlign: "center",
                padding: "60px 24px",
              }}
            >
              No Active Users!
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
