import { useState } from "react"
import './CalendarModal.css'
import { axiosInstance } from "../../utils/axiosInterceptor";

const CalendarModal = ({ onClose, onSubmit, initialData = null }) => {
    const [shareLink, setShareLink] = useState();
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        name: initialData?.name || "",
        description: initialData?.description || "",
        color: initialData?.color || "#039be5",
        timezone: initialData?.timezone || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); 
        onClose();
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    const colorOptions = [
        "#039be5", "#7986cb", "#33b679", "#f6bf26", "#e67c73",
        "#8e24aa", "#d81b60", "#ef6c00", "#3f51b5", "#0097a7"
    ];

    const handleShare = async (role, id) => {
        try {
            // const response = await axiosInstance.post(`/calendars/${id}/invite?role=${role}`);
            // console.log(response);
            // setShareLink(`http://localhost:5173/invite/${response.data.data}`)
        } catch (e) {
            console.log(error);
        }
    } 

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isEditMode ? "Edit Calendar" : "Create New Calendar"}</h2>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="close-button"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="calendar-name">Calendar name</label>
                        <input 
                            id="calendar-name"
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="Enter calendar name"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="calendar-description">Description</label>
                        <textarea
                            id="calendar-description"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Add a description (optional)"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Calendar color</label>
                        <div className="color-picker">
                            {colorOptions.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setFormData({...formData, color})}
                                    aria-label={`Select color ${color}`}
                                >
                                    {formData.color === color && (
                                        <span className="checkmark">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="calendar-timezone">Timezone</label>
                        <input
                            id="calendar-timezone"
                            type="text"
                            value={formData.timezone}
                            onChange={e => setFormData({...formData, timezone: e.target.value})}
                            placeholder="e.g., America/New_York (optional)"
                        />
                    </div>

                    {isEditMode && (
                        <div>
                            <button type="button" onClick={() => handleShare("editor", formData.id)}>Add editor</button>
                            <button type="button" onClick={() => handleShare("follower", formData.id)}>Share</button>
                            {shareLink && (
                                <div className="share-container">
                                    <input type="text" value={shareLink} readOnly className="share-input" />
                                    <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(shareLink)}
                                    className="copy-button"
                                    >
                                    Copy
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            {isEditMode ? "Save Changes" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CalendarModal