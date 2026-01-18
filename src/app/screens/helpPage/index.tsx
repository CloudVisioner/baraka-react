import React from "react";
import {
  Box,
  Container,
  Stack,
  Tabs,
  Tab,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import "../../../css/help.css";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

export default function HelpPage() {
  const [value, setValue] = React.useState("1");
  const theme = useTheme();

  /** HANDLERS **/
  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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
            Help & Support
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
            Find answers to common questions or contact our support team
          </Typography>
        </Box>

        <TabContext value={value}>
          {/* Tabs */}
          <Box
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              marginBottom: theme.spacing(4),
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                "& .MuiTab-root": {
                  fontFamily: appleFont,
                  fontSize: "17px",
                  fontWeight: 500,
                  textTransform: "none",
                  letterSpacing: "-0.01em",
                  color: "#1D1D1F",
                  opacity: 0.7,
                  minHeight: "48px",
                  padding: theme.spacing(1.5, 3),
                  "&.Mui-selected": {
                    color: "#1D1D1F",
                    fontWeight: 600,
                    opacity: 1,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#1D1D1F",
                  height: "2px",
                },
              }}
            >
              <Tab label="Terms of Service" value={"1"} />
              <Tab label="FAQ" value={"2"} />
              <Tab label="Contact Us" value={"3"} />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Box>
            {/* Terms Tab */}
            <TabPanel value={"1"} sx={{ padding: 0 }}>
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
                    Terms of Service
                  </Typography>
                  <Stack spacing={3}>
                    {terms.map((term, index) => (
                      <Box key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: theme.spacing(2),
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "#007AFF",
                              marginTop: theme.spacing(1),
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "16px",
                              fontWeight: 400,
                              color: "#1D1D1F",
                              lineHeight: 1.7,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {term}
                          </Typography>
                        </Box>
                        {index < terms.length - 1 && (
                          <Divider
                            sx={{
                              marginTop: theme.spacing(3),
                              borderColor: "rgba(0, 0, 0, 0.08)",
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </TabPanel>

            {/* FAQ Tab */}
            <TabPanel value={"2"} sx={{ padding: 0 }}>
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
                    Frequently Asked Questions
                  </Typography>
                  <Stack spacing={2}>
                    {faq.map((item, index) => (
                      <Accordion
                        key={index}
                        elevation={0}
                        sx={{
                          backgroundColor: "#F5F5F7",
                          borderRadius: "12px !important",
                          marginBottom: theme.spacing(1),
                          "&:before": {
                            display: "none",
                          },
                          "&.Mui-expanded": {
                            margin: theme.spacing(0, 0, 1, 0),
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon
                              sx={{
                                color: "#1D1D1F",
                                fontSize: "24px",
                              }}
                            />
                          }
                          sx={{
                            padding: theme.spacing(2, 2.5),
                            minHeight: "56px",
                            "&.Mui-expanded": {
                              minHeight: "56px",
                            },
                            "& .MuiAccordionSummary-content": {
                              margin: 0,
                              "&.Mui-expanded": {
                                margin: 0,
                              },
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "16px",
                              fontWeight: 500,
                              color: "#1D1D1F",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {item.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{
                            padding: theme.spacing(0, 2.5, 2.5, 2.5),
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "17px",
                              fontWeight: 400,
                              color: "#1D1D1F",
                              lineHeight: 1.7,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {item.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Contact Tab */}
            <TabPanel value={"3"} sx={{ padding: 0 }}>
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
                  <Box sx={{ marginBottom: theme.spacing(4) }}>
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "24px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        color: "#1D1D1F",
                        marginBottom: theme.spacing(1),
                      }}
                    >
                      Contact Us
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "17px",
                        fontWeight: 400,
                        color: "#1D1D1F",
                        letterSpacing: "-0.01em",
                        opacity: 0.8,
                      }}
                    >
                      Fill out the form below to send us a message
                    </Typography>
                  </Box>

                  <form
                    action={"#"}
                    method={"POST"}
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Handle form submission
                    }}
                  >
                    <Stack spacing={3}>
                      {/* Name Field */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "16px",
                            fontWeight: 500,
                            color: "#1D1D1F",
                            marginBottom: theme.spacing(1.5),
                          }}
                        >
                          Your Name
                        </Typography>
                        <TextField
                          fullWidth
                          name={"memberNick"}
                          placeholder={"Enter your name"}
                          variant="outlined"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fontFamily: appleFont,
                              fontSize: "17px",
                              borderRadius: "12px",
                              backgroundColor: "#F5F5F7",
                              "& fieldset": {
                                borderColor: "rgba(0, 0, 0, 0.08)",
                              },
                              "&:hover fieldset": {
                                borderColor: "rgba(0, 0, 0, 0.12)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#1D1D1F",
                                borderWidth: "1px",
                              },
                              "& input": {
                                color: "#1D1D1F",
                                padding: theme.spacing(1.5, 2),
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Email Field */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "16px",
                            fontWeight: 500,
                            color: "#1D1D1F",
                            marginBottom: theme.spacing(1.5),
                          }}
                        >
                          Your Email
                        </Typography>
                        <TextField
                          fullWidth
                          type={"email"}
                          name={"memberEmail"}
                          placeholder={"Enter your email"}
                          variant="outlined"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fontFamily: appleFont,
                              fontSize: "17px",
                              borderRadius: "12px",
                              backgroundColor: "#F5F5F7",
                              "& fieldset": {
                                borderColor: "rgba(0, 0, 0, 0.08)",
                              },
                              "&:hover fieldset": {
                                borderColor: "rgba(0, 0, 0, 0.12)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#1D1D1F",
                                borderWidth: "1px",
                              },
                              "& input": {
                                color: "#1D1D1F",
                                padding: theme.spacing(1.5, 2),
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Message Field */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "16px",
                            fontWeight: 500,
                            color: "#1D1D1F",
                            marginBottom: theme.spacing(1.5),
                          }}
                        >
                          Message
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          name={"memberMsg"}
                          placeholder={"Enter your message"}
                          variant="outlined"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fontFamily: appleFont,
                              fontSize: "17px",
                              borderRadius: "12px",
                              backgroundColor: "#F5F5F7",
                              "& fieldset": {
                                borderColor: "rgba(0, 0, 0, 0.08)",
                              },
                              "&:hover fieldset": {
                                borderColor: "rgba(0, 0, 0, 0.12)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#1D1D1F",
                                borderWidth: "1px",
                              },
                              "& textarea": {
                                color: "#1D1D1F",
                                padding: theme.spacing(1.5, 2),
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Submit Button */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          paddingTop: theme.spacing(2),
                        }}
                      >
                        <Button
                          type={"submit"}
                          variant="contained"
                          startIcon={<SendIcon />}
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "17px",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: "12px",
                            padding: theme.spacing(1.5, 4),
                            backgroundColor: "#007AFF",
                            color: "#FFFFFF",
                            boxShadow: "none",
                            minWidth: "140px",
                            "&:hover": {
                              backgroundColor: "#0051D5",
                              boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3)",
                            },
                          }}
                        >
                          Send Message
                        </Button>
                      </Box>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            </TabPanel>
          </Box>
        </TabContext>
      </Container>
    </Box>
  );
}
