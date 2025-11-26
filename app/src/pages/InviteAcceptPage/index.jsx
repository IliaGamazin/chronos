import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInterceptor";

const InviteAcceptPage = () => {

    const { token } = useParams();
    const navigate = useNavigate();

    const handleAccept = async () => {
        try {
            // const response = await axiosInstance.post(`/calendars/invite/${token}`);
            // console.log(response)
            navigate("/dashboard");
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <div>
            <button onClick={() => handleAccept()}>Accept</button>
            <button onClick={() => navigate("/dashboard")}>Decline</button>
        </div>
    )

}

export default InviteAcceptPage;