import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Stack,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useGlobals } from "../../hooks/useGlobal";
import { MemberUpdateInput } from "../../../lib/types/member";
import { useState } from "react";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import { T } from "../../../lib/types/common";
import MemberService from "../../services/MemberService";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/uploads/${authMember.memberImage}`
      : "/icons/default-user.svg"
  );
  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: authMember?.memberNick,
      memberPhone: authMember?.memberPhone,
      memberPassword: authMember?.memberPassword,
      memberAddress: authMember?.memberAddress,
      memberDesc: authMember?.memberDesc,
      memberPoints: authMember?.memberPoints,
      memberImage: authMember?.memberImage,
    }
  );

  // ** Handlers ** //
  const memberNickHandler = (e: T) => {
    memberUpdateInput.memberNick = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberPhoneHandler = (e: T) => {
    memberUpdateInput.memberPhone = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberAddressHandler = (e: T) => {
    memberUpdateInput.memberAddress = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberDescriptionHandler = (e: T) => {
    memberUpdateInput.memberDesc = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (
        memberUpdateInput.memberNick === "" ||
        memberUpdateInput.memberPhone === "" ||
        memberUpdateInput.memberAddress === "" ||
        memberUpdateInput.memberDesc === ""
      ) {
        throw new Error(Messages.error3);
      }
      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);

      await sweetTopSmallSuccessAlert("Modified successfully!", 700);
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  const handlerImageViewer = (e: T) => {
    const file = e.target.files[0];
    const fileType = file.type;
    const validateImageTypes = ["image/jpg", "image/png", "image/jpeg"];

    if (!validateImageTypes.includes(fileType)){
      sweetErrorHandling(Messages.error5).then();
    } else {
      if(file) {
        memberUpdateInput.memberImage = file;
        setMemberImage(URL.createObjectURL(file));
      }
    }

  };

  const theme = useTheme();

  return (
    <Box>
      {/* Profile Image Upload */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing(3),
          marginBottom: theme.spacing(4),
          padding: theme.spacing(3),
          borderRadius: "16px",
          backgroundColor: "#F5F5F7",
        }}
      >
        <Avatar
          src={memberImage}
          sx={{
            width: 100,
            height: 100,
            border: "4px solid #FFFFFF",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: "16px",
              fontWeight: 500,
              color: "#1D1D1F",
              marginBottom: theme.spacing(0.5),
            }}
          >
            Profile Picture
          </Typography>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: "13px",
              fontWeight: 400,
              color: "#1D1D1F",
              marginBottom: theme.spacing(2),
              opacity: 0.7,
            }}
          >
            JPG, JPEG, PNG formats only (Max 5MB)
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onChange={handlerImageViewer}
            sx={{
              fontFamily: appleFont,
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "12px",
              padding: theme.spacing(1, 2.5),
              borderColor: "rgba(0, 0, 0, 0.12)",
              color: "#1D1D1F",
              "&:hover": {
                borderColor: "rgba(0, 0, 0, 0.24)",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Upload Image
            <input type="file" hidden accept="image/jpeg,image/jpg,image/png" />
          </Button>
        </Box>
      </Box>

      {/* Form Fields */}
      <Stack spacing={3}>
        {/* Username */}
        <Box>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: "14px",
              fontWeight: 500,
              color: "#1D1D1F",
              marginBottom: theme.spacing(1.5),
            }}
          >
            Username
          </Typography>
          <TextField
            fullWidth
            placeholder={authMember?.memberNick || "Enter username"}
            value={memberUpdateInput.memberNick || ""}
            name="memberNick"
            onChange={memberNickHandler}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: appleFont,
                fontSize: "15px",
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

        {/* Phone and Address Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: theme.spacing(3),
          }}
        >
          {/* Phone */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "14px",
                fontWeight: 500,
                color: "#1D1D1F",
                marginBottom: theme.spacing(1.5),
              }}
            >
              Phone
            </Typography>
            <TextField
              fullWidth
              placeholder={authMember?.memberPhone || "Enter phone number"}
              value={memberUpdateInput.memberPhone || ""}
              name="memberPhone"
              onChange={memberPhoneHandler}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: appleFont,
                  fontSize: "15px",
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

          {/* Address */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "14px",
                fontWeight: 500,
                color: "#1D1D1F",
                marginBottom: theme.spacing(1.5),
              }}
            >
              Address
            </Typography>
            <TextField
              fullWidth
              placeholder={
                authMember?.memberAddress || "Enter your address"
              }
              value={memberUpdateInput.memberAddress || ""}
              name="memberAddress"
              onChange={memberAddressHandler}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: appleFont,
                  fontSize: "15px",
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
        </Box>

        {/* Description */}
        <Box>
          <Typography
            sx={{
              fontFamily: appleFont,
              fontSize: "14px",
              fontWeight: 500,
              color: "#1D1D1F",
              marginBottom: theme.spacing(1.5),
            }}
          >
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder={
              authMember?.memberDesc || "Tell us about yourself..."
            }
            value={memberUpdateInput.memberDesc || ""}
            name="memberDesc"
            onChange={memberDescriptionHandler}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: appleFont,
                fontSize: "15px",
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
      </Stack>

      {/* Save Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: theme.spacing(4),
          paddingTop: theme.spacing(3),
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Button
          variant="contained"
          onClick={handleSubmitButton}
          sx={{
            fontFamily: appleFont,
            fontSize: "15px",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "12px",
            padding: theme.spacing(1.5, 4),
            backgroundColor: "#007AFF",
            color: "#FFFFFF",
            boxShadow: "none",
            minWidth: "120px",
            "&:hover": {
              backgroundColor: "#0051D5",
              boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3)",
            },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}
