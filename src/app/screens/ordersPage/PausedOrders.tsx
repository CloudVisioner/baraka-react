import React, { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  useTheme,
  IconButton,
  Chip,
} from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { Messages, normalizeImagePath } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/orders";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling, sweetConfirmDialog } from "../../../lib/sweetAlert";
import Swal from "sweetalert2";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobal";
import { useHistory } from "react-router-dom";
import OrderService from "../../services/OrderService";
import moment from "moment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders }) // just selcted data name
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);
  const history = useHistory();
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const [paymentImages, setPaymentImages] = useState<Record<string, string>>({}); // Preview URLs
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({}); // Selected files (not uploaded yet)

  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      
      const confirmed = await sweetConfirmDialog(
        "Delete Order?",
        "Are you sure you want to delete this order? This action cannot be undone.",
        "Delete",
        "Cancel"
      );

      if (confirmed) {
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      sweetErrorHandling(err);
    }
  };

  // Handle file selection - only shows preview, doesn't upload
  const handleFileSelection = (e: T, orderId: string) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Only JPG, JPEG, and PNG images are allowed");
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB");
      }

      // Store the selected file
      setSelectedFiles(prev => ({ ...prev, [orderId]: file }));

      // Show preview (frontend only)
      const imageUrl = URL.createObjectURL(file);
      setPaymentImages(prev => ({ ...prev, [orderId]: imageUrl }));
    } catch (err: any) {
      let errorMessage = "Something went wrong!";
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: errorMessage,
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#007AFF",
        background: "#FFFFFF",
        color: "#1D1D1F",
      });
    }
  };

  // Actually upload the file to backend
  const submitPaymentProof = async (orderId: string) => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      const file = selectedFiles[orderId];
      if (!file) {
        throw new Error("Please select an image first");
      }

      setUploadingOrderId(orderId);

      // Upload payment image using updateOrder with file
      // Set status to PENDING - admin will approve (PROCESS) or reject (REJECTED)
      const order = new OrderService();
      const updateInput: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PENDING, // Set to PENDING - awaiting admin approval
        paymentImage: file,
      };
      await order.updateOrder(updateInput);

      // Show success message
      await sweetConfirmDialog(
        "Payment Proof Uploaded",
        "Your payment proof has been uploaded successfully. Our team will review and verify it. Once approved, your order will move to the Processing tab. Please check back later.",
        "OK",
        ""
      );

      // Clear selected file and preview
      setSelectedFiles(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
      
      // Clean up preview URL
      if (paymentImages[orderId]) {
        URL.revokeObjectURL(paymentImages[orderId]);
        setPaymentImages(prev => {
          const newState = { ...prev };
          delete newState[orderId];
          return newState;
        });
      }

      // Reset file input
      const input = document.getElementById(`payment-upload-${orderId}`) as HTMLInputElement;
      if (input) {
        input.value = "";
      }

      // Refresh orders to show updated state (order stays in Awaiting Payment Proof tab)
      setOrderBuilder(new Date());
    } catch (err: any) {
      console.error("Payment upload error:", err);
      
      // Extract more specific error message
      let errorMessage = "Something went wrong!";
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server error: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Unable to connect to server. Please check your internet connection or try again later.";
      } else if (err.message) {
        // Error message from validation or other source
        errorMessage = err.message;
      }
      
      await Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: errorMessage,
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#007AFF",
        background: "#FFFFFF",
        color: "#1D1D1F",
      });
    } finally {
      setUploadingOrderId(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>, orderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Only JPG, JPEG, and PNG images are allowed",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#007AFF",
        background: "#FFFFFF",
        color: "#1D1D1F",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Image size must be less than 5MB",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#007AFF",
        background: "#FFFFFF",
        color: "#1D1D1F",
      });
      return;
    }

    // Store the selected file
    setSelectedFiles(prev => ({ ...prev, [orderId]: file }));

    // Show preview (frontend only)
    const imageUrl = URL.createObjectURL(file);
    setPaymentImages(prev => ({ ...prev, [orderId]: imageUrl }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removePaymentImage = (orderId: string) => {
    setPaymentImages(prev => {
      const newState = { ...prev };
      delete newState[orderId];
      return newState;
    });
  };

  const theme = useTheme();

  return (
    <TabPanel value={"1"} sx={{ padding: 0 }}>
      <Stack spacing={3}>
        {pausedOrders && pausedOrders.length > 0 ? (
          pausedOrders.map((order: Order) => {
          return (
              <Card
                key={order._id}
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ padding: theme.spacing(4) }}>
                  <Stack spacing={2} sx={{ marginBottom: theme.spacing(3) }}>
                {order?.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.filter(
                    (ele: Product) => item.productId === ele._id
                  )[0];
                  if (!product || !product.productImages?.length) return null;
                      const imagePath = normalizeImagePath(
                        product.productImages?.[0]
                      );
                  return (
                        <Box
                          key={item._id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing(2),
                            padding: theme.spacing(2),
                            borderRadius: "12px",
                            backgroundColor: "#F5F5F7",
                          }}
                        >
                          <Avatar
                            src={imagePath}
                            variant="rounded"
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: "8px",
                            }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontFamily: appleFont,
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#1D1D1F",
                                marginBottom: theme.spacing(0.5),
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {product.productName}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: appleFont,
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "#1D1D1F",
                              }}
                            >
                              ${item.itemPrice} × {item.itemQuantity}
                            </Typography>
                      </Box>
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "17px",
                              fontWeight: 600,
                              color: "#1D1D1F",
                            }}
                          >
                            ${(item.itemQuantity * item.itemPrice).toFixed(2)}
                          </Typography>
                    </Box>
                  );
                })}
                  </Stack>

                  <Divider sx={{ marginBottom: theme.spacing(3) }} />

                  {/* Payment Image Upload Section */}
                  <Box
                    sx={{
                      marginBottom: theme.spacing(3),
                    }}
                  >
                    {/* Show uploaded payment image from backend if exists */}
                    {order.paymentImage && order.orderStatus !== OrderStatus.REJECTED ? (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing(1),
                            marginBottom: theme.spacing(2),
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#1D1D1F",
                            }}
                          >
                            Payment Proof Status
                          </Typography>
                          <Chip
                            label={order.orderStatus === OrderStatus.PENDING ? "Pending Approval" : "Awaiting Approval"}
                            size="small"
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "12px",
                              fontWeight: 500,
                              backgroundColor: "#FFF4E6",
                              color: "#E67E22",
                              height: "20px",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            position: "relative",
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: "2px solid #FFF4E6",
                            backgroundColor: "#F5F5F7",
                            marginBottom: theme.spacing(2),
                          }}
                        >
                          <Box
                            component="img"
                            src={normalizeImagePath(order.paymentImage)}
                            alt="Payment proof uploaded"
                            sx={{
                              width: "100%",
                              maxHeight: "300px",
                              objectFit: "contain",
                              display: "block",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: theme.spacing(1),
                              right: theme.spacing(1),
                              backgroundColor: "#FFF4E6",
                              color: "#E67E22",
                              padding: theme.spacing(0.5, 1),
                              borderRadius: "8px",
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: appleFont,
                                fontSize: "12px",
                                fontWeight: 500,
                              }}
                            >
                              Uploaded
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            backgroundColor: "#FFF4E6",
                            borderRadius: "12px",
                            padding: theme.spacing(2),
                            border: "1px solid #FFE5CC",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#E67E22",
                              lineHeight: 1.5,
                            }}
                          >
                            Your payment proof has been uploaded and is awaiting admin approval. Once approved, your order will move to the Processing tab.
                          </Typography>
                        </Box>
                      </Box>
                    ) : order.orderStatus === OrderStatus.REJECTED ? (
                      <Box>
                        <Box
                          sx={{
                            backgroundColor: "#FFEBEE",
                            borderRadius: "12px",
                            padding: theme.spacing(2),
                            border: "1px solid #FFCDD2",
                            marginBottom: theme.spacing(2),
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#C62828",
                              lineHeight: 1.5,
                              marginBottom: theme.spacing(1),
                            }}
                          >
                            Payment Proof Rejected
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#C62828",
                              lineHeight: 1.5,
                            }}
                          >
                            Your payment proof was rejected by our team. Please upload a new payment proof image to proceed with your order.
                          </Typography>
                        </Box>
                        {order.paymentImage && (
                          <Box
                            sx={{
                              position: "relative",
                              borderRadius: "12px",
                              overflow: "hidden",
                              border: "2px solid #FFCDD2",
                              backgroundColor: "#F5F5F7",
                              marginBottom: theme.spacing(2),
                            }}
                          >
                            <Box
                              component="img"
                              src={normalizeImagePath(order.paymentImage)}
                              alt="Rejected payment proof"
                              sx={{
                                width: "100%",
                                maxHeight: "300px",
                                objectFit: "contain",
                                display: "block",
                                opacity: 0.6,
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: theme.spacing(1),
                                right: theme.spacing(1),
                                backgroundColor: "#FFEBEE",
                                color: "#C62828",
                                padding: theme.spacing(0.5, 1),
                                borderRadius: "8px",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: appleFont,
                                  fontSize: "12px",
                                  fontWeight: 500,
                                }}
                              >
                                Rejected
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        
                        {/* Upload section for rejected orders - allow re-upload */}
                        <Box
                          sx={{
                            marginTop: theme.spacing(2),
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#1D1D1F",
                              marginBottom: theme.spacing(1),
                            }}
                          >
                            Upload New Payment Proof
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#6E6E73",
                              marginBottom: theme.spacing(2),
                              lineHeight: 1.5,
                            }}
                          >
                            Please upload a new payment proof image. You can use the same image or upload a different one.
                          </Typography>
                          
                          {paymentImages[order._id] ? (
                            <Box
                              sx={{
                                position: "relative",
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: "2px solid #007AFF",
                                backgroundColor: "#F5F5F7",
                                marginBottom: theme.spacing(2),
                              }}
                            >
                              <Box
                                component="img"
                                src={paymentImages[order._id]}
                                alt="New payment proof preview"
                                sx={{
                                  width: "100%",
                                  maxHeight: "300px",
                                  objectFit: "contain",
                                  display: "block",
                                }}
                              />
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: theme.spacing(1),
                                  right: theme.spacing(1),
                                  display: "flex",
                                  gap: theme.spacing(1),
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: theme.spacing(0.5),
                                    backgroundColor: "#007AFF",
                                    color: "#FFFFFF",
                                    padding: theme.spacing(0.5, 1),
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: appleFont,
                                      fontSize: "12px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Preview
                                  </Typography>
                                </Box>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    if (paymentImages[order._id]) {
                                      URL.revokeObjectURL(paymentImages[order._id]);
                                    }
                                    setPaymentImages(prev => {
                                      const newState = { ...prev };
                                      delete newState[order._id];
                                      return newState;
                                    });
                                    setSelectedFiles(prev => {
                                      const newState = { ...prev };
                                      delete newState[order._id];
                                      return newState;
                                    });
                                    const input = document.getElementById(`payment-upload-${order._id}`) as HTMLInputElement;
                                    if (input) {
                                      input.value = "";
                                    }
                                  }}
                                  sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    "&:hover": {
                                      backgroundColor: "#FFFFFF",
                                    },
                                  }}
                                >
                                  <CloseIcon sx={{ fontSize: "18px", color: "#1D1D1F" }} />
                                </IconButton>
                              </Box>
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: theme.spacing(1),
                                  left: theme.spacing(1),
                                  right: theme.spacing(1),
                                  backgroundColor: "rgba(0, 122, 255, 0.9)",
                                  borderRadius: "8px",
                                  padding: theme.spacing(1),
                                  textAlign: "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: appleFont,
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: "#FFFFFF",
                                  }}
                                >
                                  Click "Re-upload Payment Proof" below to submit
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Box
                              component="label"
                              htmlFor={`payment-upload-${order._id}`}
                              onDrop={(e: React.DragEvent<HTMLLabelElement>) => handleDrop(e, order._id)}
                              onDragOver={(e: React.DragEvent<HTMLLabelElement>) => handleDragOver(e)}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: theme.spacing(4),
                                border: "2px dashed rgba(0, 0, 0, 0.12)",
                                borderRadius: "12px",
                                backgroundColor: "#F5F5F7",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": {
                                  borderColor: "#007AFF",
                                  backgroundColor: "#F0F7FF",
                                },
                              }}
                            >
                              <input
                                type="file"
                                id={`payment-upload-${order._id}`}
                                accept="image/jpeg,image/jpg,image/png"
                                style={{ display: "none" }}
                                onChange={(e) => handleFileSelection(e, order._id)}
                                disabled={uploadingOrderId === order._id}
                              />
                              <CloudUploadIcon
                                sx={{
                                  fontSize: "48px",
                                  color: uploadingOrderId === order._id ? "#6E6E73" : "#007AFF",
                                  marginBottom: theme.spacing(2),
                                }}
                              />
                              <Typography
                                sx={{
                                  fontFamily: appleFont,
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  color: uploadingOrderId === order._id ? "#6E6E73" : "#1D1D1F",
                                  marginBottom: theme.spacing(0.5),
                                }}
                              >
                                {uploadingOrderId === order._id ? "Uploading..." : "Upload New Payment Receipt"}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: appleFont,
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  color: "#6E6E73",
                                  textAlign: "center",
                                }}
                              >
                                Click to upload a new screenshot or photo of your bank transfer receipt
                                <br />
                                <span style={{ fontSize: "12px" }}>JPG, PNG (Max 5MB)</span>
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing(1),
                            marginBottom: theme.spacing(1),
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#1D1D1F",
                            }}
                          >
                            Upload Payment Proof
                          </Typography>
                          <Chip
                            label="Required"
                            size="small"
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "12px",
                              fontWeight: 500,
                              backgroundColor: "#FF3B30",
                              color: "#FFFFFF",
                              height: "20px",
                            }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#6E6E73",
                            marginBottom: theme.spacing(2),
                            lineHeight: 1.5,
                          }}
                        >
                          After making the bank transfer, please upload a screenshot or photo of your payment receipt. Our team will verify it and process your order.
                        </Typography>
                        
                        {paymentImages[order._id] ? (
                      <Box
                        sx={{
                          position: "relative",
                          borderRadius: "12px",
                          overflow: "hidden",
                          border: "2px solid #007AFF",
                          backgroundColor: "#F5F5F7",
                        }}
                      >
                        <Box
                          component="img"
                          src={paymentImages[order._id]}
                          alt="Payment proof preview"
                          sx={{
                            width: "100%",
                            maxHeight: "300px",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: theme.spacing(1),
                            right: theme.spacing(1),
                            display: "flex",
                            gap: theme.spacing(1),
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: theme.spacing(0.5),
                              backgroundColor: "#007AFF",
                              color: "#FFFFFF",
                              padding: theme.spacing(0.5, 1),
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: appleFont,
                                fontSize: "12px",
                                fontWeight: 500,
                              }}
                            >
                              Preview
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => {
                              // Remove preview and selected file
                              if (paymentImages[order._id]) {
                                URL.revokeObjectURL(paymentImages[order._id]);
                              }
                              setPaymentImages(prev => {
                                const newState = { ...prev };
                                delete newState[order._id];
                                return newState;
                              });
                              setSelectedFiles(prev => {
                                const newState = { ...prev };
                                delete newState[order._id];
                                return newState;
                              });
                              // Reset file input
                              const input = document.getElementById(`payment-upload-${order._id}`) as HTMLInputElement;
                              if (input) {
                                input.value = "";
                              }
                            }}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              "&:hover": {
                                backgroundColor: "#FFFFFF",
                              },
                            }}
                          >
                            <CloseIcon sx={{ fontSize: "18px", color: "#1D1D1F" }} />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: theme.spacing(1),
                            left: theme.spacing(1),
                            right: theme.spacing(1),
                            backgroundColor: "rgba(0, 122, 255, 0.9)",
                            borderRadius: "8px",
                            padding: theme.spacing(1),
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: appleFont,
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#FFFFFF",
                            }}
                          >
                            Click "Upload Payment Proof" below to submit
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        component="label"
                        htmlFor={`payment-upload-${order._id}`}
                        onDrop={(e: React.DragEvent<HTMLLabelElement>) => handleDrop(e, order._id)}
                        onDragOver={(e: React.DragEvent<HTMLLabelElement>) => handleDragOver(e)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: theme.spacing(4),
                          border: "2px dashed rgba(0, 0, 0, 0.12)",
                          borderRadius: "12px",
                          backgroundColor: "#F5F5F7",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#007AFF",
                            backgroundColor: "#F0F7FF",
                          },
                        }}
                      >
                        <input
                          type="file"
                          id={`payment-upload-${order._id}`}
                          accept="image/jpeg,image/jpg,image/png"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileSelection(e, order._id)}
                          disabled={uploadingOrderId === order._id}
                        />
                        <CloudUploadIcon
                          sx={{
                            fontSize: "48px",
                            color: uploadingOrderId === order._id ? "#6E6E73" : "#007AFF",
                            marginBottom: theme.spacing(2),
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "16px",
                            fontWeight: 500,
                            color: uploadingOrderId === order._id ? "#6E6E73" : "#1D1D1F",
                            marginBottom: theme.spacing(0.5),
                          }}
                        >
                          {uploadingOrderId === order._id ? "Uploading..." : "Upload Payment Receipt"}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: appleFont,
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#6E6E73",
                            textAlign: "center",
                          }}
                        >
                          Click to upload a screenshot or photo of your bank transfer receipt
                          <br />
                          <span style={{ fontSize: "12px" }}>JPG, PNG (Max 5MB)</span>
                        </Typography>
                      </Box>
                    )}
                      </>
                    )}
                  </Box>

                  <Divider sx={{ marginBottom: theme.spacing(3) }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: theme.spacing(1.5),
                      marginBottom: theme.spacing(3),
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        Subtotal
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "17px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        ${(order.orderTotal - order.orderDelivery).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        Delivery
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "17px",
                          fontWeight: 500,
                          color: "#1D1D1F",
                        }}
                      >
                        ${order.orderDelivery.toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider sx={{ marginTop: theme.spacing(1) }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: theme.spacing(1),
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#1D1D1F",
                        }}
                      >
                        Total
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: appleFont,
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#1D1D1F",
                        }}
                      >
                        ${order.orderTotal.toFixed(2)}
                      </Typography>
              </Box>
                </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: theme.spacing(2),
                      justifyContent: "flex-end",
                    }}
                  >
                <Button
                  value={order._id}
                      variant="outlined"
                      startIcon={<DeleteOutlineIcon />}
                  onClick={deleteOrderHandler}
                      sx={{
                        fontFamily: appleFont,
                        fontSize: "17px",
                        fontWeight: 500,
                        textTransform: "none",
                        borderRadius: "12px",
                        padding: theme.spacing(1.5, 3),
                        borderColor: "rgba(0, 0, 0, 0.12)",
                        color: "#1D1D1F",
                        "&:hover": {
                          borderColor: "rgba(0, 0, 0, 0.24)",
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                >
                  Cancel
                </Button>
                {order.orderStatus === OrderStatus.PENDING && order.paymentImage ? (
                  <Button
                    variant="outlined"
                    disabled
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "17px",
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: "12px",
                      padding: theme.spacing(1.5, 3),
                      borderColor: "#FFF4E6",
                      color: "#E67E22",
                      cursor: "not-allowed",
                      backgroundColor: "#FFF4E6",
                    }}
                  >
                    Pending Approval
                  </Button>
                ) : (order.orderStatus === OrderStatus.REJECTED || order.orderStatus === OrderStatus.PAUSE || !order.paymentImage) && selectedFiles[order._id] ? (
                  <Button
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    onClick={() => submitPaymentProof(order._id)}
                    disabled={uploadingOrderId === order._id}
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "17px",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "12px",
                      padding: theme.spacing(1.5, 3),
                      backgroundColor: uploadingOrderId === order._id ? "#6E6E73" : order.orderStatus === OrderStatus.REJECTED ? "#FF3B30" : "#007AFF",
                      color: "#FFFFFF",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: uploadingOrderId === order._id ? "#6E6E73" : order.orderStatus === OrderStatus.REJECTED ? "#D32F2F" : "#0051D5",
                        boxShadow: order.orderStatus === OrderStatus.REJECTED ? "0 4px 12px rgba(255, 59, 48, 0.3)" : "0 4px 12px rgba(0, 122, 255, 0.3)",
                      },
                    }}
                  >
                    {uploadingOrderId === order._id ? "Uploading..." : order.orderStatus === OrderStatus.REJECTED ? "Re-upload Payment Proof" : "Upload Payment Proof"}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    disabled={!!(order.orderStatus === OrderStatus.PENDING && order.paymentImage)}
                    sx={{
                      fontFamily: appleFont,
                      fontSize: "17px",
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: "12px",
                      padding: theme.spacing(1.5, 3),
                      borderColor: order.orderStatus === OrderStatus.PENDING && order.paymentImage ? "#FFF4E6" : "rgba(0, 0, 0, 0.12)",
                      color: order.orderStatus === OrderStatus.PENDING && order.paymentImage ? "#E67E22" : "#6E6E73",
                      cursor: order.orderStatus === OrderStatus.PENDING && order.paymentImage ? "not-allowed" : "default",
                      backgroundColor: order.orderStatus === OrderStatus.PENDING && order.paymentImage ? "#FFF4E6" : "transparent",
                    }}
                  >
                    {order.orderStatus === OrderStatus.PENDING && order.paymentImage ? "Pending Approval" : order.orderStatus === OrderStatus.REJECTED ? "Select New Image" : "Select Image First"}
                  </Button>
                )}
              </Box>
                </CardContent>
              </Card>
          );
          })
        ) : (
            <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: theme.spacing(8),
              textAlign: "center",
            }}
            >
              <img
                src={"/icons/noimage-list.svg"}
              alt="No orders"
              style={{ width: 200, height: 200, opacity: 0.5 }}
              />
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "20px",
                fontWeight: 500,
                color: "#1D1D1F",
                marginTop: theme.spacing(3),
                marginBottom: theme.spacing(1),
              }}
            >
              No orders awaiting payment proof
            </Typography>
            <Typography
              sx={{
                fontFamily: appleFont,
                fontSize: "17px",
                fontWeight: 400,
                color: "#1D1D1F",
              }}
            >
              Orders requiring payment proof upload will appear here
            </Typography>
            </Box>
        )}
      </Stack>
    </TabPanel>
  );
}
