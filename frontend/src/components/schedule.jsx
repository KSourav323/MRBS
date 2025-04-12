import React, { useState, useEffect } from 'react';
import '../style/schedule.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Schedule = ({ areaId, selectedDate }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const user = useSelector(state => state.user);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingMap, setBookingMap] = useState({});

    const timeSlots = Array.from({ length: 34 }, (_, i) => {
        const totalMinutes = (7 * 60) + (i * 30); 
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    });

    useEffect(() => {
        if (!bookings.length) {
            setBookingMap({}); 
            setIsLoading(false);
            return;
        }
        
        const map = {};
        bookings.forEach(booking => {
            const timeSlots = getTimeSlotsBetween(booking.start_time, booking.end_time);
            timeSlots.forEach(time => {
                const key = `${booking.room_id}-${time}`;
                map[key] = {
                    booking,
                    status: booking.is_approved
                };
            });
        });
        setBookingMap(map);
        setIsLoading(false);
    }, [bookings]);

    useEffect(() => {
        if (!areaId) return;
        if (user.isLoggedIn) {
            axios
                .post('http://localhost:5000/api/listRoom',
                    { area_id: areaId },
                    { withCredentials: true }
                )
                .then((response) => {
                    if (response.status === 201) {
                        setRooms(response.data.data);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch rooms:', error);
                });
        }
        else{
          axios
                .post('http://localhost:5000/public/listRoom',
                    { area_id: areaId },
                    { withCredentials: true }
                )
                .then((response) => {
                    if (response.status === 201) {
                        setRooms(response.data.data);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch rooms:', error);
                });
        }
    }, [areaId, user]); 

    useEffect(() => {
        if (!areaId || !selectedDate) return;

        if (user.isLoggedIn) {
            axios
                .post('http://localhost:5000/api/listBookings',
                    { area_id: areaId, date: selectedDate },
                    { withCredentials: true }
                )
                .then((response) => {
                    if (response.status === 201) {
                        setBookings(response.data.data);
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch rooms:', error);
                    setIsLoading(false);
                });
        }
        else{
          axios
                .post('http://localhost:5000/public/listBookings',
                    { area_id: areaId, date: selectedDate },
                    { withCredentials: true }
                )
                .then((response) => {
                    if (response.status === 201) {
                        setBookings(response.data.data);
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch rooms:', error);
                    setIsLoading(false);
                });
        }
    }, [areaId, selectedDate, user]); 


    const addOneHour = (time) => {
        const [hours, minutes] = time.split(':');
        const newHours = (parseInt(hours) + 1).toString().padStart(2, '0');
        return `${newHours}:${minutes}`;
      };

    const bookSlot = (roomId, time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const bookingDateTime = new Date(selectedDate);
        bookingDateTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        
        if (bookingDateTime > now) {
      if (!user?.isLoggedIn) {
        window.location.href = 'http://localhost:5000/auth/google/callback';
        return;
      }
      navigate('/book', {
        state: { 
          areaId: areaId, 
          roomId: roomId,
          date: selectedDate,
          startTime: time,
          endTime: addOneHour(time)
        }
      });
    }else{ 
        toast.warning('Please select a future time !');
    }
    }

    const getTimeSlotsBetween = (start, end) => {
        const slots = [];
        let current = start;
        while (current < end) {
            slots.push(current);
            const [hours, minutes] = current.split(':');
            const totalMinutes = parseInt(hours) * 60 + parseInt(minutes) + 30;
            const newHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
            const newMinutes = (totalMinutes % 60).toString().padStart(2, '0');
            current = `${newHours}:${newMinutes}`;
        }
        return slots;
    };

    const handleCellClick = (roomId, time) => {
        const key = `${roomId}-${time}`;
        const bookingData = bookingMap[key];
        
        if (bookingData) {
            navigate('/requestInfo', {
                state: { entryData: bookingData.booking }
            });
        } else {
            bookSlot(roomId, time);
        }
    };

    const getBookingStatus = (roomId, time) => {
        if (isLoading) return null;
        const key = `${roomId}-${time}`;
        return bookingMap[key]?.status ?? null;
    };

    const getBookingData = (roomId, time) => {
        if (isLoading) return null;
        const key = `${roomId}-${time}`;
        return bookingMap[key];
    };
    
  return (
    <div id="schedule-container">
            {rooms.length > 0 ? (
                <table id='schedule-table'>
                    <thead id='schedule-head'>
                        <tr id='schedule-tr'>
                            <th className='time-col'>Time</th>
                            {rooms.map(room => (
                                <th key={room.id}>{room.room_name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody id='schedule-body'>
                        {timeSlots.map((time, index) => (
                        <tr className='schedule-row' key={index}>
                            <td className="time-col" >{time}</td> 
                            {rooms.map(room => {
                                    const status = getBookingStatus(room.id, time);
                                    const bookingData = getBookingData(room.id, time);
                                    const statusClass = status === 1 ? 'approved' : 
                                                      status === 0 ? 'pending' : '';
                                    return (
                                        <td 
                                            key={`${room.id}-${time}`} 
                                            className={`booking-cell ${statusClass}`}
                                            onClick={() => handleCellClick(room.id, time)}
                                        >
                                            {bookingData && (
                                                <span className="booking-subject">
                                                    {bookingData.booking.subject}
                                                </span>
                                            )}
                                        </td>
                                    );
                                })}
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No rooms found for this area</p>
            )}
        </div>
  );
};


export default Schedule;
