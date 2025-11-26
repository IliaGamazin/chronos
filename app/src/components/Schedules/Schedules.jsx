import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useState, useEffect } from 'react'

import "./Schedules.css"
import SideBar from '../SideBar/SideBar'
import { axiosInstance } from '../../utils/axiosInterceptor'
import CalendarModal from '../CalendarModal/CalendarModal'

const Schedules = () => {

  const eventsService = useState(() => createEventsServicePlugin())[0]

  const [isCalendarModalOpen, setCalendarModalOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null); 

  const [userCalendars, setUserCalendars] = useState([]);
  const [editableCalendars, setEditableCalendars] = useState([]);
  const [followedCalendars, setFollowedCalendars] = useState([]);

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [],
    plugins: [eventsService]
  })

	useEffect(() => {
		const fetchData = async () => {
			try {
				// const [user, editable, followed] = await Promise.all([
				// 	axiosInstance.get("/calendars/?status=owned"),
				// 	axiosInstance.get("/calendars/?status=editable"),
				// 	axiosInstance.get("/calendars/?status=followed"),
				// ]);
				// setUserCalendars(user.data.data);
				// setEditableCalendars(editable.data.data);
				// setFollowedCalendars(followed.data.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);

  const handleOpenCreate = () => {
    setEditingCalendar(null);
    setCalendarModalOpen(true);
  }

  const handleOpenEdit = (calendarData) => {
    setEditingCalendar(calendarData);
    setCalendarModalOpen(true);
  }

  const handleClose = () => {
    setCalendarModalOpen(false);
    setEditingCalendar(null);
  }

  const handleSubmit = async (formData) => {
    try {
      // if (formData.id) {
      //   console.log(formData.id)
      //   const response = await axiosInstance.patch(`/calendars/${formData.id}`, formData);
      //   const updatedCalendar = response.data.data;
        
      //   setUserCalendars(prev => prev.map(cal => 
      //     cal.id === formData.id ? updatedCalendar : cal
      //   ));
        
      //   setEditableCalendars(prev => prev.map(cal => 
      //     cal.id === formData.id ? updatedCalendar : cal
      //   ));
        
      //   setFollowedCalendars(prev => prev.map(cal => 
      //     cal.id === formData.id ? updatedCalendar : cal
      //   ));
      // } else {
      //   const response = await axiosInstance.post("/calendars/", formData);
      //   setUserCalendars(prev => [...prev, response.data.data]);
      // }
      
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCalendar = async (id) => {
     try {
         //await axiosInstance.delete(`/calendars/${id}`);
         setUserCalendars(prev => prev.filter(c => c.id !== id));
         setEditableCalendars(prev => prev.filter(c => c.id !== id));
         setFollowedCalendars(prev => prev.filter(c => c.id !== id));
     } catch(error) {
         console.log(error);
     }
  }

  return(
    <div className='schedules-body'>
      {isCalendarModalOpen && (
        <CalendarModal 
            onClose={handleClose} 
            onSubmit={handleSubmit}
            initialData={editingCalendar}
        />
      )}
      
      <SideBar 
          userCalendars={userCalendars} 
          editableCalendars={editableCalendars} 
          followedCalendars={followedCalendars} 
          onCreateCalendar={handleOpenCreate}
          onEditCalendar={handleOpenEdit} 
          onDeleteCalendar={handleDeleteCalendar}
      />
      
      <main className='schedule'>
        <ScheduleXCalendar className="schedule" calendarApp={calendar} /> 
      </main>
    </div>
  )
}

export default Schedules