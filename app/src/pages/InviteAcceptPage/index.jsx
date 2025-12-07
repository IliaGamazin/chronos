import { useNavigate, useParams } from 'react-router-dom';
import './InviteAcceptPage.css';
import CustomButton from '@/shared/CustomButton';
import { useAcceptInvite } from '@/hooks/useInvites';

const InviteAcceptPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const acceptMutation = useAcceptInvite();

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync(token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to accept invite:', error);
    }
  };

  const handleDecline = () => {
    navigate('/dashboard');
  };

  return (
    <div className="invite-page">
      <div className="invite-card">
        <h1 className="invite-title">Calendar Invitation</h1>

        <p className="invite-description">
          You have been invited to join a calendar.
          <br />
          Would you like to accept this invitation?
        </p>

        <div className="invite-actions">
          <CustomButton
            onClick={handleAccept}
            variant="primary"
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending ? 'Accepting...' : 'Accept'}
          </CustomButton>

          <CustomButton
            onClick={handleDecline}
            variant="secondary"
            disabled={acceptMutation.isPending}
          >
            Decline
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default InviteAcceptPage;
