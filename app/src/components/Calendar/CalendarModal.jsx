import { useState, useEffect } from 'react';
import Modal from '@/shared/Modal';
import CustomInput from '@/shared/CustomInput';
import CustomTextarea from '@/shared/CustomTextarea';
import CustomButton from '@/shared/CustomButton';
import './InviteModal.css';

const CalendarModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        color: '#3b82f6',
      });
    }
  }, [isOpen]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({
      ...formData,
      timezone: 'UTC',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Calendar">
      <form onSubmit={handleSubmit} className="invite-form">
        <CustomInput
          type="text"
          name="name"
          label="Calendar Name"
          placeholder="Enter calendar name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <CustomTextarea
          name="description"
          label="Description (optional)"
          placeholder="Enter calendar description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />

        <div className="color-input-wrapper">
          <label htmlFor="color">Color</label>
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="calendar-color-input"
          />
        </div>

        <div className="form-actions">
          <CustomButton
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create Calendar'}
          </CustomButton>
        </div>
      </form>
    </Modal>
  );
};

export default CalendarModal;
