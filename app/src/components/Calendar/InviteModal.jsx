import { useState, useEffect } from 'react';
import { Copy, Check, Mail } from 'lucide-react';
import Modal from '@/shared/Modal';
import CustomSelect from '@/shared/CustomSelect';
import CustomButton from '@/shared/CustomButton';
import CustomInput from '@/shared/CustomInput';
import IconButton from '@/shared/IconButton';
import './InviteModal.css';

const InviteModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  categories,
  inviteLink,
}) => {
  const [formData, setFormData] = useState({
    calendar: '',
    role: 'follower',
    email: '',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const firstCalendar = Object.keys(categories)[0] || '';
      setFormData({
        calendar: firstCalendar,
        role: 'follower',
        email: '',
      });
      setCopied(false);
    }
  }, [isOpen, categories]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCopyLink = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isEmailMode = formData.email.trim().length > 0;
  const buttonText = isEmailMode ? 'Send Invitation' : 'Get Invite Link';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite People">
      <form onSubmit={handleSubmit} className="invite-form">
        <CustomSelect
          id="calendar"
          name="calendar"
          label="Calendar"
          value={formData.calendar}
          onChange={handleChange}
          required
        >
          {Object.entries(categories).map(([key, category]) => (
            <option key={key} value={key}>
              {category.name}
            </option>
          ))}
        </CustomSelect>

        <CustomSelect
          id="role"
          name="role"
          label="Permission"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="follower">Follower</option>
          <option value="editor">Editor</option>
        </CustomSelect>

        {!inviteLink && (
          <div className="email-input-wrapper">
            <CustomInput
              type="email"
              name="email"
              label="Email Address (Optional)"
              placeholder="Leave empty to generate a link only"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail size={16} />}
            />
          </div>
        )}

        {inviteLink && (
          <div className="invite-link-container">
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-end',
                width: '100%',
              }}
            >
              <CustomInput
                type="text"
                name="invite-link"
                label="Invitation Link"
                value={inviteLink}
                readOnly
                containerStyle={{ flex: 1, width: '100%' }}
              />
              <IconButton
                onClick={handleCopyLink}
                variant="primary"
                title={copied ? 'Copied!' : 'Copy link'}
                className="copy-link-btn"
                style={{
                  height: '42px',
                  width: '42px',
                  flexShrink: 0,
                  marginBottom: '2px',
                }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </IconButton>
            </div>
          </div>
        )}

        <div className="form-actions">
          <CustomButton
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            {inviteLink ? 'Done' : 'Cancel'}
          </CustomButton>

          {!inviteLink && (
            <CustomButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEmailMode
                  ? 'Sending...'
                  : 'Generating...'
                : buttonText}
            </CustomButton>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default InviteModal;
