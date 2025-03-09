/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import Paper from '@mui/material/Paper';
import NewForm from "../components/Form";
import { useSelector } from 'react-redux';
import { users } from "../assets/authSlice";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EditOrderForm from "../components/EditOrderForm";
import DeleteIcon from '@mui/icons-material/Delete';
import DrawerNav from "../components/AdminDrawerNav";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { UserInfo, Order } from "../interfaces/interface";
import { Box, CircularProgress, Tooltip } from '@mui/material';
import { useDeleteOrdersMutation, useGetAdminOrdersQuery, useGetSingleOrderMutation, useUpdateOrderMutation } from "../api/OrderSlice";

const paginationModel = { page: 0, pageSize: 5 };

export default function Admin() {
    // Extract user information & Annotate it 
    const userInfo = useSelector(users) as UserInfo;

    // Extract Name
    const name = userInfo.name;

    // Manage Closing & Opening of Modal
    const [modalOpen, setModalOpen] = useState(false);


    // Modal Functions
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);


    // Modal state for Edit Order
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);


    // Apply RTK Query Hooks
    const { data: orders, isLoading, isError } = useGetAdminOrdersQuery();
    const [deleteOrder] = useDeleteOrdersMutation(); 
    const [getSingleOrder] = useGetSingleOrderMutation();
    const [updateOrder] = useUpdateOrderMutation(); 


    // Handle API errors
    useEffect(() => {
        if (isError) {
            toast.error("Error fetching data.");
        }
    }, [isError]);

    
    // Delete Order Handler
    const handleDelete = async (orderId: string) => {
        const confirm = window.confirm("Are you sure you want to delete this user?");
        if (confirm) {
            try {
                await deleteOrder(orderId).unwrap();
                toast.success("Order deleted successfully!");
            } catch (error) {
                console.error("Error Deleting Order", error);
                toast.error("Failed to delete order.");
            }
        }
    };


    // Edit Order Handler
    const handleEdit = async (orderId: string) => {
        try {
            const orderData = await getSingleOrder(orderId).unwrap(); // Fetch order data
            setSelectedOrder(orderData); // Update selected order
            setEditModalOpen(true); // Open the modal
        } catch (error) {
            console.error("Failed to fetch order:", error);
            toast.error("Failed to fetch order details.");
        }
    };


    // Save Order Handler
    const handleSave = (orderId: string, orderData: Order) => {
        updateOrder({ id: orderId, orderData })
            .then(() => {
                console.log("Order updated successfully!");
            })
            .catch((error: any) => {
                console.error("Failed to update order:", error);
            });
    };


    // Prepare rows for DataGrid
    const rows = orders
        ? orders.Orders.map((order: Order, index: number) => ({
            id: order._id,
            index: index + 1,
            customer: order.customerName,
            quantity: order.quantity,
            price: order.price,
            status: order.status,
            product: order.productName,
        }))
        : [];


    // Define DataGrid columns
    const columns: GridColDef[] = [
        { field: 'index', headerName: 'No', width: 70 },
        { field: 'customer', headerName: 'Customer Name', width: 190 },
        { field: 'product', headerName: 'Product Name', width: 150 },
        { field: 'price', headerName: 'Price', width: 150 },
        { field: 'quantity', headerName: 'Quantity', width: 150 },
        { field: 'status', headerName: 'Status', width: 120 },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center space-x-2">
                    <Tooltip title="Edit Order">
                        <EditIcon
                            sx={{ color: "#2962ff", cursor: "pointer" }}
                            onClick={() =>
                                handleEdit(params.row.id) // Pass id directly
                            }
                        />
                    </Tooltip>
                    <Tooltip title="Delete Order">
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
        <>
            <div>
                <DrawerNav />
                <div className="lg:ml-64 mx-6 my-4">
                    <h1 className="flex justify-end font-serif text-lg">Welcome {name}</h1>

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
                    <NewForm open={modalOpen} close={handleClose} />

                    {/* Modal for Edit Order */}
                    <EditOrderForm
                        open={editModalOpen}
                        close={() => setEditModalOpen(false)}
                        order={selectedOrder}
                        onSave={handleSave}
                    />

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
                                        Total Quantity:{" "}
                                        {orders?.Orders.reduce((total: number, order: Order) => total + order.quantity, 0)}
                                    </h1>
                                    <h1 className="text-xl font-bold">
                                        Total Amount:{" "}
                                        ${orders?.Orders.reduce(
                                            (total: number, order: Order) => total + order.quantity * order.price,
                                            0
                                        )}
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
        </>
    );
}