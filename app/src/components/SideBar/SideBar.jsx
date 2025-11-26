import { useState } from 'react'
import CustomButton from '../../shared/CustomButton'
import './Sidebar.css'

const SideBar = ({
    userCalendars = [], 
    editableCalendars = [], 
    followedCalendars = [], 
    onCreateCalendar, 
    onEditCalendar, 
    onDeleteCalendar
}) => {

  const [openSections, setOpenSections] = useState({
    "My Calendars": true,
    "Editable Calendars": true,
    "Followed Calendars": true
  });

  const toggleSection = (title) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const sections = [
    { title: "My Calendars", data: userCalendars, canEdit: true },
    { title: "Editable Calendars", data: editableCalendars, canEdit: true }, 
    { title: "Followed Calendars", data: followedCalendars, canEdit: false },
  ];

  return (
    <aside className="sidebar">
      <CustomButton className="create-button create-calendar" onClick={onCreateCalendar}>
        Create Calendar
      </CustomButton>

      {sections.map(({ title, data, canEdit }) => (
        <div key={title} className="calendar-section">
          <button 
            className={`section-header ${openSections[title] ? 'open' : ''}`}
            onClick={() => toggleSection(title)}
          >
             <span className="section-title">{title}</span>
          </button>
          
          {openSections[title] && data.length > 0 && (
            <div className="calendar-list">
              {data.map((c) => (
                <label key={c.id} className="calendar-item">
                  <input
                    type="checkbox"
                    className="calendar-checkbox"
                    defaultChecked
                  />
                  <span 
                    className="calendar-color" 
                    style={{ backgroundColor: c.color}}
                  />
                  <span className="calendar-name">{c.name}</span>
                  <div className='edit-buttons'>
                    {canEdit && (
                      <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault(); 
                                onEditCalendar(c);
                            }}
                        >
                          Edit
                      </button>
                    )}
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            onDeleteCalendar(c.id);
                        }}
                    >
                      Delete
                    </button>
                  </div>

                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}

export default SideBar