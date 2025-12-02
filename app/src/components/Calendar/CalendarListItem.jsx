import Checkbox from '@/shared/Checkbox';
import IconButton from '@/shared/IconButton'
import {Pencil } from 'lucide-react';

const CalendarListItem = ({ calendarKey, category, onToggle, onEditToggle }) => {
  return (
    <li className="calendar-item">
      <label className="calendar-toggle">
        <Checkbox
          checked={category.visible}
          onChange={() => onToggle(calendarKey)}
          variant="primary"
        />
        <span
          className="calendar-color"
          style={{ backgroundColor: category.color }}
        />
        <span className="calendar-name">{category.name}</span>
        <span className='edit-toggle'>
          <IconButton 
            onClick={() => onEditToggle(category)}
            title="Edit Calendar"
            variant="secondary"
          >
            <Pencil size={16} />  
          </IconButton>          
        </span>

      </label>
    </li>
  );
};

export default CalendarListItem;
