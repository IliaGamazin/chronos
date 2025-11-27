import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import Modal from '@/shared/Modal';
import CustomSelect from '@/shared/CustomSelect';
import CustomButton from '@/shared/CustomButton';
import CustomInput from '@/shared/CustomInput';
import IconButton from '@/shared/IconButton';
import './InviteModal.css';

const InviteModal = ({ isOpen, onClose, onSubmit, isSubmitting, categories, inviteLink }) => {
  const [formData, setFormData] = useState({
    calendar: '',
    role: 'follower',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const firstCalendar = Object.keys(categories)[0] || '';
      setFormData({
        calendar: firstCalendar,
        role: 'follower',
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Invitation">
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
          label="Role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="follower">Follower</option>
          <option value="editor">Editor</option>
        </CustomSelect>

        {inviteLink && (
          <div className="invite-link-container">
            <CustomInput
              type="text"
              name="invite-link"
              label="Invitation Link"
              value={inviteLink}
              readOnly
            />
            <IconButton
              onClick={handleCopyLink}
              variant="primary"
              title={copied ? 'Copied!' : 'Copy link'}
              className="copy-link-btn"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </IconButton>
          </div>
        )}

        <div className="form-actions">
          <CustomButton
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            {inviteLink ? 'Close' : 'Cancel'}
          </CustomButton>
          {!inviteLink && (
            <CustomButton type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Invitation'}
            </CustomButton>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default InviteModal;
