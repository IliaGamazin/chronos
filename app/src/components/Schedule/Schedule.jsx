import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useState, useEffect} from 'react'

import "./Schedule.css"

const eventMenu = ({fatherObj}) => {

}

 
function Schedule() {
    const today = Temporal.Now.plainDateISO();
    const tomorrow = today.add({ days: 1 });
  const eventsService = useState(() => createEventsServicePlugin())[0]
 
  const calendar = useCalendarApp({
        calendars: {
            work: {
            colorName: 'work',
            lightColors: {
                main: '#f91c45',
                container: '#ffd2dc',
                onContainer: '#59000d',
            }
        }
    },
    callbacks: {
    onDoubleClickDateTime(dateTime) {
      const newId = Math.random().toString(36).substr(2, 9);
      
      eventsService.add({
        id: newId,
        title: 'New Event',
        start: dateTime,
        end: dateTime.add({minutes: 30}),
      })
    },

    onDoubleClickDate(date) {
      const newId = Math.random().toString(36).substr(2, 9);
      
      eventsService.add({
        id: newId,
        title: 'New Full Day Event',
        start: date,
        end: date,
      })
    },
  },
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [
    {
        id: 1,
        title: 'Coffee with John',
        start: today.toZonedDateTime({ timeZone: 'Europe/Berlin', plainTime: '10:05' }),
        end: today.toZonedDateTime({ timeZone: 'Europe/Berlin', plainTime: '10:35' }),
        calendarId: "work",
    },
    {
        id: 2,
        title: 'Ski trip',
        start: tomorrow.toZonedDateTime({ timeZone: 'Europe/Berlin', plainTime: '10:05' }),
        end: tomorrow.add({ days: 2 }).toZonedDateTime({ timeZone: 'Europe/Berlin', plainTime: '10:05' }),
    },
    ],
    plugins: [eventsService, 
        createDragAndDropPlugin(5),
        createResizePlugin(),
    ]
  })
 
  useEffect(() => {
    eventsService.getAll()
  }, [])

 
  return (
    <div className='schedule'>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default Schedule