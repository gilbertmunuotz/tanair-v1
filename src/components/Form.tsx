import { useState } from "react";
import { toast } from "react-toastify";
import { users } from "../assets/authSlice";
import { useSelector } from "react-redux";
import { useCreateOrderMutation } from "../api/OrderSlice";
import { ModalProps, Order, UserInfo } from "../interfaces/interface";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

export default function Form({ open, close }: ModalProps) {

    // Extract user Info From Redux Store
    const userInfo = useSelector(users) as UserInfo;

    // Extract user ID from user Slice
    const user = userInfo.id;

    const [customerName, setcustomerName] = useState<string>('');
    const [productName, setproductName] = useState<string>('');
    const [quantity, setquantity] = useState<number>(0);
    const [price, setprice] = useState<number>(0);

    // Destructure Hook
    const [createnewOrder, { isError, isLoading }] = useCreateOrderMutation();


    // Handle Data Submission
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        const newOrder: Order = { customerName, productName, quantity, price, user: user };

        try {
            await createnewOrder(newOrder).unwrap();
            setcustomerName('')
            setproductName('')
            setquantity(0)
            setprice(0)
            toast.success("Order Created Successfully");
        } catch (error) {
            console.error("Error Creating Order", error);
            toast.error("Sorry, an error occurred.");
        }

        if (isError) {
            toast.error("Sorry, an error occurred.");
        }
    }

    return (
        <div>
            <>
                <Modal open={open} onClose={close}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, border: '1px solid #000', p: 4, backgroundColor: 'background.paper', boxShadow: 24, maxHeight: '80vh', overflow: 'auto', }}>
                        <Typography className="text-center">
                            Create New Order
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <TextField
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    value={customerName}
                                    label="Enter Name"
                                    placeholder="E.g John Smith"
                                    onChange={(event) => setcustomerName(event.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <TextField
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    value={productName}
                                    label="Enter Product"
                                    placeholder="E.g Sofa Bed"
                                    onChange={(event) => setproductName(event.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <TextField
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    value={quantity}
                                    label="Enter quantity"
                                    placeholder="E.g 5"
                                    onChange={(event) => setquantity(Number(event.target.value))}
                                />
                            </div>

                            <TextField
                                fullWidth
                                required
                                value={price}
                                variant="outlined"
                                label="Enter Amount"
                                placeholder="E.g 1200"
                                onChange={(event) => setprice(Number(event.target.value))}
                            />


                            {isLoading ?
                                <button
                                    type="submit"
                                    className="my-3 py-2 px-28 rounded-md cursor-not-allowed text-white bg-indigo-600 uppercase">Creating...........</button>
                                : <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 2, backgroundColor: "#4f46e5", }} className="rounded-xl">Create</Button>
                            }

                        </form>

                    </Box>
                </Modal>
            </>
        </div >
    )
}