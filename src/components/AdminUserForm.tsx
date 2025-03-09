import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateUserrMutation } from "../api/UserSlice";
import { ModalProps, User } from "../interfaces/interface";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

export default function Form({ open, close }: ModalProps) {

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setpassword] = useState<string>('');
    const [role, setrole] = useState<string>('user');

    // Destructure Hook
    const [createnewUser, { isError, isLoading }] = useCreateUserrMutation();


    // Handle Data Submission
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        const newUser: User = { name, email, password, role };

        try {
            await createnewUser(newUser).unwrap();
            setName('')
            setEmail('')
            setpassword('')
            setrole('')
            toast.success("User Created Successfully");
        } catch (error) {
            console.error("Error Creating User", error);
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
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, border: '1px solid #000', p: 4, backgroundColor: 'background.paper', boxShadow: 24, maxHeight: '80vh', overflow: 'auto', }}> <Typography className="text-center">
                        Create New User
                    </Typography>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <TextField
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    value={name}
                                    label="Enter Name"
                                    placeholder="E.g John Smith"
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <TextField
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    value={email}
                                    label="Enter Email"
                                    placeholder="E.g johnsmith@gmail.com"
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <TextField
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    value={password}
                                    label="Enter Password"
                                    placeholder="E.g 5"
                                    onChange={(event) => setpassword(event.target.value)}
                                />
                            </div>

                            <div className="flex gap-6 mt-2">
                                <label>
                                    <input type="radio" checked={role === "user"} onChange={() => setrole("user")} />  User
                                </label>
                                <label>
                                    <input type="radio" checked={role === "admin"} onChange={() => setrole("admin")} /> Admin
                                </label>
                            </div>


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