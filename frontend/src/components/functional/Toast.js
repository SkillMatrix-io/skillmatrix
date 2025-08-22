import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

export const showToast = {
    success: (msg) =>
        toast.success(msg, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        }),
    error: (msg) =>
        toast.error(msg, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        }),
    loading: (msg) =>
        toast.loading(msg, {
            toastId: "global-loader",
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            draggable: false,
        }),
    info: (msg) =>
        toast.info(msg, {
            position: "bottom-right",
            autoClose: 4000,
        }),
    warn: (msg) =>
        toast.warn(msg, {
            position: "bottom-right",
            autoClose: 4000,
        }),
}
export default function ToastProvider() {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light">
        </ToastContainer>
    )
}