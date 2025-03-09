import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { users } from "../assets/authSlice";
import { Modal, Box, TextField, Button } from "@mui/material";
import { EditUserFormProps, User, UserInfo } from "../interfaces/interface";

export default function EditUserForm({ open, close, user, onSave }: EditUserFormProps) {

    // Extract user information & Annotate it 
    const userInfo = useSelector(users) as UserInfo;

    // Extract Id
    const userId = userInfo.id;


    const [formData, setFormData] = useState<User | null>();

    useEffect(() => {
        if (user) {
            setFormData(user); // Update form data when the order changes
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSave = () => {
        if (formData) {
            const userData = {
                ...formData,
                user: userId, // Add the user ID here
            };
            onSave(user?._id as string, userData);
            close(); // Close the modal
            toast.success("User Updated Succesfully!")
        }
    };

    return (
        <div>
            <>
                <Modal open={open} onClose={close}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, border: '1px solid #000', p: 4, backgroundColor: 'background.paper', boxShadow: 24, maxHeight: '80vh', overflow: 'auto', }}>

                        <h3 className="text-center">Update User</h3>


                        <TextField
                            fullWidth
                            required
                            name="name"
                            margin="normal"
                            variant="outlined"
                            label="Enter Name"
                            value={formData?.name || ""}
                            placeholder="E.g John Smith"
                            onChange={handleInputChange}
                        />



                        <TextField
                            fullWidth
                            required
                            name="email"
                            margin="normal"
                            variant="outlined"
                            label="Enter Email"
                            onChange={handleInputChange}
                            value={formData?.email || ""}
                            placeholder="E.g johnsmith@gmail.com"
                        />

                        <TextField
                            fullWidth
                            required
                            value={formData?.password || ""}
                            margin="normal"
                            name="password"
                            variant="outlined"
                            label="Enter Password"
                            placeholder="Enter Password"
                            onChange={handleInputChange}
                        />

                        <Box mt={2}>
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData?.role || ""} // Use formData?.role
                                onChange={(e) =>
                                    setFormData({ ...formData!, role: e.target.value })
                                }
                                style={{ width: "100%", padding: "8px", marginTop: "8px", borderRadius: "4px", borderColor: "#d1d5db" }}
                            >
                                <option value="" disabled>Select Role</option>
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                            </select>
                        </Box>


                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button onClick={close} sx={{ mr: 1 }}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave}>
                                Update
                            </Button>
                        </Box>


                    </Box>
                </Modal>
            </>
        </div>
    )
}