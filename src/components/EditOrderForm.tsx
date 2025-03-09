import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
import { users } from "../assets/authSlice";
import React, { useEffect, useState } from "react";
import { Box, Modal, TextField, Button } from "@mui/material";
import { Order, EditOrderFormProps, UserInfo } from "../interfaces/interface";

export default function EditOrderForm({ open, close, order, onSave }: EditOrderFormProps) {

    // Extract user information & Annotate it 
    const userInfo = useSelector(users) as UserInfo;

    // Extract Id
    const userId = userInfo.id;


    const [formData, setFormData] = useState<Order | null>(order);

    useEffect(() => {
        if (order) {
            setFormData(order); // Update form data when the order changes
        }
    }, [order]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSave = () => {
        if (formData) {
            const orderData = {
                ...formData,
                user: userId, // Add the user ID here
            };
            onSave(order?._id as string, orderData);
            close(); // Close the modal
            toast.success("Order Updated Succesfully!")
        }
    };

    if (!order) return null; // Don't render if no order is selected


    return (
        <Modal open={open} onClose={close}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <h2 className="text-center">Edit Order</h2>

                {/* Customer Name */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Customer Name"
                    required
                    name="customerName"
                    value={formData?.customerName || ""}
                    onChange={handleInputChange}
                />

                {/* Product Name */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Product Name"
                    required
                    name="productName"
                    value={formData?.productName || ""}
                    onChange={handleInputChange}
                />

                {/* Price */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Price"
                    required
                    name="price"
                    type="number"
                    value={formData?.price || ""}
                    onChange={handleInputChange}
                />

                {/* Quantity */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Quantity"
                    required
                    name="quantity"
                    type="number"
                    value={formData?.quantity || ""}
                    onChange={handleInputChange}
                />

                {/* Status */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Status"
                    required
                    name="status"
                    value={formData?.status || ""}
                    onChange={handleInputChange}
                />

                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button onClick={close} sx={{ mr: 1 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};    