import React, { useState , useEffect} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/datePicker.css';

const DatePicker = ({ onDateSelect, selectedDate }) => {
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  useEffect(() => {
    if (!selectedDate) {
      onDateSelect(new Date());
    }
  }, []);

  const nextMonthDate = new Date(activeStartDate);
  nextMonthDate.setMonth(activeStartDate.getMonth() + 1);

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setActiveStartDate(activeStartDate);
  };

  return (
    <div className="calendar-container">
      <Calendar
        onClickDay={onDateSelect}
        value={selectedDate}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={handleActiveStartDateChange}
        tileClassName={({ date, view }) => {
          if (
            view === 'month' &&
            date.toDateString() === new Date().toDateString()
          ) {
            return 'today';
          }
        }}
      />
      <Calendar
          onClickDay={onDateSelect}
          value={selectedDate}
          activeStartDate={nextMonthDate}
        onActiveStartDateChange={handleActiveStartDateChange}
        
          tileClassName={({ date, view }) => {
            if (
              view === 'month' &&
              date.toDateString() === new Date().toDateString()
            ) {
              return 'today';
            }
          }}
        />
    </div>
  )
}

export default DatePicker