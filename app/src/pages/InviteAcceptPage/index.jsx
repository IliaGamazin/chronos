import { useNavigate, useParams } from "react-router-dom";
import "./InviteAcceptPage.css";
import CustomButton from "@/shared/CustomButton";
import { useEffect, useState } from "react";

const InviteAcceptPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role) setRole(payload.role);
      } catch (e) {
        console.log(e);
      }
    }
  }, [token]);

  const handleAccept = async () => {
    try {
      //API call
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="invite-page">
      <div className="invite-card">
        <h1 className="invite-title">Invitation</h1>

        <p className="invite-description">
          You have been invited to join a calendar as <strong>{role}</strong>.
          <br />
          Would you like to accept this invitation?
        </p>

        <div className="invite-actions">
          <CustomButton
            onClick={handleAccept}
            variant="primary"
          >
            Accept
          </CustomButton>

          <CustomButton
            onClick={() => navigate("/dashboard")}
            variant="secondary"
          >
            Decline
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default InviteAcceptPage;
