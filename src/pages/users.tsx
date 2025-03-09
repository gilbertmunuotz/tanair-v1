/* eslint-disable @typescript-eslint/no-explicit-any */
import Paper from '@mui/material/Paper';
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import { User } from "../interfaces/interface";
import EditIcon from '@mui/icons-material/Edit';
import NewForm from "../components/AdminUserForm";
import DeleteIcon from "@mui/icons-material/Delete";
import DrawerNav from "../components/AdminDrawerNav";
import EditUserForm from '../components/EditUserForm';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, CircularProgress, Tooltip } from '@mui/material';
import { useDeleteUserMutation, useGetAllUsersQuery, useGetSingleUserMutation, useUpdateUserMutation } from "../api/UserSlice";

const paginationModel = { page: 0, pageSize: 5 };


export default function Users() {

    // Manage Closing & Opening of Modal
    const [modalOpen, setModalOpen] = useState(false);


    // Modal Functions
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);


    // Modal state for Edit User
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    // Apply RTK Query Hooks
    const { data: users, isError, isLoading } = useGetAllUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [getSingleUser] = useGetSingleUserMutation();
    const [updateUser] = useUpdateUserMutation();


    // Handle API errors
    useEffect(() => {
        if (!users && isError) {
            toast.error("Error fetching data.");
        }
    }, [users, isError]);


    // Delete User Handler
    const handleDelete = async (userId: string) => {
        const confirm = window.confirm("Are you sure you want to delete this user?");
        if (confirm) {
            try {
                await deleteUser(userId).unwrap();
                toast.success("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user.");
            }
        }
    };


    // Edit User Handler
    const handleEdit = async (userId: string) => {
        try {
            const userData = await getSingleUser(userId).unwrap(); // Fetch user data
            setSelectedUser(userData); // Update selected user
            setEditModalOpen(true); // Open the edit modal
        } catch (error) {
            console.error("Failed to fetch user:", error);
            toast.error("Failed to fetch user details.");
        }
    }
    

    // Save User Handler
    const handleSave = (userId: string, userData: User) => {
        updateUser({ id: userId, userData })
            .then(() => {
                console.log("User updated successfully!");
            })
            .catch((error: any) => {
                console.error("Failed to update user:", error);
            });
    };


    // Prepare rows for DataGrid
    const rows = users
        ? users.Users.map((user: User, index: number) => ({
            id: user._id,
            index: index + 1,
            name: user.name,
            email: user.email,
            role: user.role,
        }))
        : [];


    // Define DataGrid columns
    const columns: GridColDef[] = [
        { field: 'index', headerName: 'No', width: 70 },
        { field: 'name', headerName: 'User Name', width: 150 },
        { field: 'email', headerName: 'User Email', width: 190 },
        { field: 'role', headerName: 'Role', width: 100 },
        {
            field: 'action',
            headerName: 'Edit',
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center space-x-2">
                    <Tooltip title="Edit User">
                        <EditIcon
                            sx={{ color: "#2962ff", cursor: "pointer" }}
                            onClick={() =>
                                handleEdit(params.row.id) // Pass id directly
                            }
                        />
                    </Tooltip>

                    <Tooltip title="Delete User">
                        <DeleteIcon
                            sx={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </Tooltip>
                </div >
            ),
        },
    ];


    return (
        <div>
            <DrawerNav />
            <div className="lg:ml-64 mx-6 my-4">

                <div className="flex justify-end mt-4">
                    <button className="rounded-full bg-indigo-600 px-5 py-1.5 ml-4" onClick={handleOpen}>
                        <Tooltip title={'New User'}>
                            <div className="flex items-center space-x-2">
                                <AddIcon className="text-black" />
                                <h2 className="text-base text-black">New</h2>
                            </div>
                        </Tooltip>
                    </button>
                </div>

                {/* Pass the modal state and the close function to NewForm */}
                <div>
                    <NewForm open={modalOpen} close={handleClose} />
                </div>

                {/* Modal for Edit User */}
                <EditUserForm
                    open={editModalOpen}
                    close={() => setEditModalOpen(false)}
                    user={selectedUser}
                    onSave={handleSave}
                />


                {/* Display Data */}
                <div className="mt-8">
                    {isLoading ? (
                        // Display loading spinner while fetching data
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                            <CircularProgress />
                        </Box>
                    ) : (

                        <Paper sx={{ height: 400, width: '100%' }}>
                            {/* Calculate and Display Totals */}
                            <div className="flex justify-between items-center px-4 py-2">
                                <h1 className="text-xl font-bold">
                                    Total Users:{" "}
                                    {users?.Number}
                                </h1>
                            </div>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{ pagination: { paginationModel } }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                                sx={{ border: 0 }}
                            />
                        </Paper>
                    )}
                </div>
            </div>
        </div>
    )
}
