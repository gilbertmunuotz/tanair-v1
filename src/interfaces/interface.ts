interface LoginUserInfo {
    email: string,
    password: string
}


interface LoginResponse {
    message: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
    role: "admin" | "user";
    jwtToken: string;
}


interface UserInfo {
    id: string,
    name: string,
    email: string
}


interface ModalProps {
    open: boolean,
    close: () => void;
}

interface EditOrderFormProps {
    open: boolean;
    close: () => void;
    order: Order | null; // Pass the specific order details
    onSave: (orderId: string, orderData: Order) => void;
}


interface EditUserFormProps {
    open: boolean;
    close: () => void;
    user: User | null; // Pass the specific order details
    onSave: (userId: string, userData: User) => void;
}


interface Order {
    _id?: string,
    customerName: string,
    productName: string,
    quantity: number,
    price: number,
    status?: string,
    user?: string
}


interface User {
    _id?: string,
    name: string,
    email: string,
    password: string,
    role: string,
}

interface UserAPI {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: string; // You can use Date if you want to parse this into a Date object
    updatedAt: string; // Same for this, or Date if you'd like to parse
    __v: number;
};

interface UserResponse {
    Number: number;
    Users: UserAPI[];
};


interface OrderAPI {
    _id: string;
    customerName: string;
    productName: string;
    quantity: number;
    price: number;
    status: string;
    user: string; // Reference to a user ID
    createdAt: string; // Can also be `Date` if parsing is done
    updatedAt: string; // Same as above
    __v: number;
};


interface OrderResponse {
    Quantity: number;
    Orders: Order[];
};


export type {
    LoginUserInfo, LoginResponse, UserInfo, ModalProps,
    Order, User, UserResponse, UserAPI, OrderAPI, OrderResponse, EditOrderFormProps,
    EditUserFormProps
}