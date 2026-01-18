import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  
  // Pagination logic
  const totalPages = Math.ceil(topUsers.length / itemsPerPage);
  const displayedUsers = topUsers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FBFBFB",
        padding: { xs: "80px 24px", md: "120px 40px" },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            marginBottom: { xs: "48px", md: "64px" },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "2rem", md: "2.75rem" },
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#1D1D1F",
              marginBottom: "16px",
            }}
          >
            TOP READERS
          </Typography>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: { xs: "15px", md: "17px" },
              fontWeight: 400,
              color: "#1D1D1F",
              letterSpacing: "-0.01em",
              lineHeight: 1.5,
              maxWidth: "700px",
              margin: "0 auto",
              opacity: 0.8,
            }}
          >
            Discover our most active readers who are exploring our diverse collection of books and sharing their insights with the community.
          </Typography>
        </Box>

        {/* Profile Cards Grid */}
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
            marginBottom: "50px",
          }}
        >
          {displayedUsers.length > 0 ? (
            displayedUsers.map((member: Member) => {
              const imagePath = member.memberImage
                ? `${serverApi}/uploads/${member.memberImage}`
                : "/icons/default-user.svg";

              const booksRead = member.memberPoints || 0;

              return (
                <Box
                  key={member._id}
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    cursor: "pointer",
                    border: "1px solid rgba(0, 0, 0, 0.04)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.1)",
                      borderColor: "rgba(0, 0, 0, 0.08)",
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
                      backgroundColor: "#007AFF",
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
                      gap: "8px",
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
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                      {booksRead} {booksRead === 1 ? "Book Read" : "Books Read"}
                      </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box
              sx={{
                gridColumn: "1 / -1",
                width: "100%",
                minHeight: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: appleFont,
                fontSize: "1.375rem",
                fontWeight: 500,
                color: "#1D1D1F",
                letterSpacing: "-0.02em",
                textAlign: "center",
                padding: "60px 24px",
              }}
            >
              No Top Readers Available
            </Box>
          )}
        </Box>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentPage(index)}
                sx={{
                  width: index === currentPage ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor:
                    index === currentPage
                      ? "#007AFF"
                      : "rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      index === currentPage
                        ? "#0051D5"
                        : "rgba(0, 0, 0, 0.3)",
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
