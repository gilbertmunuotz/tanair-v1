import { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import NewForm from "../components/AdminUserForm";
import DrawerNav from "../components/AdminDrawerNav";
import { useDeleteUserMutation, useGetAllUsersQuery } from "../api/UserSlice";
import { toast } from "react-toastify";
import { User } from "../interfaces/interface";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, CircularProgress, Tooltip } from '@mui/material';
import { Link } from "react-router-dom";

const paginationModel = { page: 0, pageSize: 5 };


export default function Users() {

    // Manage Closing & Opening of Modal
    const [modalOpen, setModalOpen] = useState(false);

    // Modal Functions
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const { data: users, isError, isLoading } = useGetAllUsersQuery();
    const [deleteUser] = useDeleteUserMutation();

    useEffect(() => {
        if (!users && isError) {
            toast.error("Error fetching data.");
        }
    }, [users, isError]);

    // Delete User
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
            // headerAlign: 'right',
            // align: 'right',
            renderCell: (params) => (
                <div className="flex items-center space-x-2">
                    <Link
                        to={`user/${params.row.id}`}
                        style={{ pointerEvents: 'none', textDecoration: 'none' }} // Disable link interaction
                    className="cursor-not-none"
                    >
                        <Tooltip title="Edit User">
                            <EditIcon sx={{ color: '#2962ff', cursor: 'not-allowed' }} />
                        </Tooltip>
                    </Link>

                    <Tooltip title="Delete User">
                        <DeleteIcon
                            sx={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];


    return (
        <div>
            <DrawerNav />
            <div className="lg:ml-64 mx-6 my-4">

                <div className="flex justify-end mt-4">
                    <button className="rounded-full bg-indigo-600 px-5 py-1.5 ml-4" onClick={handleOpen}>
                        <Tooltip title={'New Order'}>
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
