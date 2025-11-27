import Checkbox from '@/shared/Checkbox';

const CalendarListItem = ({ calendarKey, category, onToggle }) => {
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
      </label>
    </li>
  );
};

export default CalendarListItem;
