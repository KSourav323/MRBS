import React, { useState, useEffect } from 'react'
import '../style/rooms.css'
import Navbar from '../components/navbar'
import axios from 'axios';
import { useSelector } from 'react-redux';
import RoomTable from '../components/roomTable';
import { toast } from 'react-toastify';

const Rooms = () => {

  const [areas, setAreas] = useState([]);
  const [showAreaForm, setShowAreaForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [areaId, setAreaId] = useState(1); 
  const [roomsUpdated, setRoomsUpdated] = useState(false);
  const [selectedAreaName, setSelectedAreaName] = useState('');
  const user = useSelector(state => state.user);

  const isAdmin = () => {
    return user?.user?.level > 1;
  };

  const [areaFormData, setAreaFormData] = useState({
    areaName: '',
    areaAdminEmail: '',
    approvalEnabled: '',
    isPublic: ''
  });

  const [roomFormData, setRoomFormData] = useState({
    areaId: areaId,
    roomName: '',
    description: '',
    capacity: '',
    roomAdminEmail: ''
  });
  
  useEffect(() => {
    if (areas.length > 0) {
      const defaultArea = areas[0];
      setAreaId(defaultArea.id);
      setSelectedAreaName(defaultArea.area_name);
      setRoomFormData(prevState => ({
        ...prevState,
        areaId: defaultArea.id
      }));
    }
  }, [areas]); 


  useEffect(() => {
    try {
        axios
          .post('http://localhost:5000/api/listArea',{},{ withCredentials: true })
          .then((response) => {
            if (response.status === 201) {
                setAreas(response.data.data);
            }
          })
      } catch (error) {
        console.error('failed:', error);
       toast.error('failed: ' + error.response?.data?.message || 'Unknown error', {
                                 autoClose: 1000
                               });
      }
  }, [showAreaForm]);

  const handleAreaFormChange = (e) => {
    const { name, value } = e.target;
    setAreaFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoomFormChange = (e) => {
    const { name, value } = e.target;
    setRoomFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post('http://localhost:5000/api/addArea', areaFormData, { withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
            toast.success('New area added!', {
              autoClose: 1000 
          });
            setShowAreaForm(false);
          }
        })
    } catch (error) {
      console.error('failed:', error);
     toast.error('failed: ' + error.response?.data?.message || 'Unknown error', {
                               autoClose: 1000
                             });
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post('http://localhost:5000/api/addRoom', roomFormData, { withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
            toast.success('New room added !', {
              autoClose: 1000 
          });
            setRoomsUpdated(prev => !prev);
            setShowRoomForm(false);
          }
        })
    } catch (error) {
      console.error('failed:', error);
     toast.error('failed: ' + error.response?.data?.message || 'Unknown error', {
                               autoClose: 1000
                             });
    }
  };

  const handleAreaChange = (e) => {
    const newAreaId = Number(e.target.value);
    const selectedArea = areas.find(area => area.id === newAreaId);
    if (selectedArea) {
      setAreaId(newAreaId);
      setSelectedAreaName(selectedArea.area_name);
      setRoomFormData(prevState => ({
        ...prevState,
        areaId: newAreaId
      }));
    }
  };


  return (
    <div id='rooms-container'>
        <Navbar/>
        {isAdmin() && (
          <div id='admin-panel'>
            <div>
              <button className='show-form-btn' onClick={() => setShowAreaForm(!showAreaForm)}>
                {showAreaForm ? 'Close' : 'Add Area'}
              </button>
              {showAreaForm && (
                <div className='popup-overlay'>
              <div className='popup-content'>
                <h2>Add New Area</h2>
                <form onSubmit={handleAreaSubmit}>
                  <div className='form-group'>
                    <label htmlFor='areaName'>Area Name</label>
                    <input
                      type='text'
                      id='areaName'
                      name='areaName'
                      value={areaFormData.areaName}
                      onChange={handleAreaFormChange}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='areaAdminEmail'>Admin Email</label>
                    <input
                      type='email'
                      id='areaAdminEmail'
                      name='areaAdminEmail'
                      value={areaFormData.areaAdminEmail}
                      onChange={handleAreaFormChange}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label>Approval Required</label>
                    <div className='radio-group'>
                      <label>
                        <input
                          type='radio'
                          name='approvalEnabled'
                          value='1'
                          checked={areaFormData.approvalEnabled === '1'}
                          onChange={handleAreaFormChange}
                          required
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type='radio'
                          name='approvalEnabled'
                          value='0'
                          checked={areaFormData.approvalEnabled === '0'}
                          onChange={handleAreaFormChange}
                          required
                        />
                        No
                      </label>
                  </div>
                </div>

                <div className='form-group'>
                  <label>Public</label>
                  <div className='radio-group'>
                    <label>
                      <input
                        type='radio'
                        name='isPublic'
                        value='1'
                        checked={areaFormData.isPublic === '1'}
                        onChange={handleAreaFormChange}
                        required
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type='radio'
                        name='isPublic'
                        value='0'
                        checked={areaFormData.isPublic === '0'}
                        onChange={handleAreaFormChange}
                        required
                      />
                      No
                    </label>
                  </div>
                </div>
                  

                  <div className='form-buttons'>
                    <button id='cancel-btn' type='button' onClick={() => setShowAreaForm(false)}>
                      Cancel
                    </button>
                    <button id='submit-btn' type='submit'>Add Area</button>
                  </div>
                </form>
              </div>
            </div>
              )}
            </div>
            <div>
              <button className='show-form-btn' onClick={() => setShowRoomForm(!showRoomForm)}>
                {showRoomForm ? 'Close' : `Add Room in ${selectedAreaName}`}
              </button>
              {showRoomForm && (
            <div className='popup-overlay'>
              <div className='popup-content'>
                <h2>Add New Room in {selectedAreaName}</h2>
                <form onSubmit={handleRoomSubmit}>
                  <div className='form-group'>
                    <label htmlFor='roomName'>Room Name</label>
                    <input
                      type='text'
                      id='roomName'
                      name='roomName'
                      value={roomFormData.roomName}
                      onChange={handleRoomFormChange}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='description'>Description</label>
                    <textarea
                      id='description'
                      name='description'
                      value={roomFormData.description}
                      onChange={handleRoomFormChange}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='capacity'>Capacity</label>
                    <input
                      type='text'
                      id='capacity'
                      name='capacity'
                      value={roomFormData.capacity}
                      onChange={handleRoomFormChange}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='roomAdminEmail'>Admin Email</label>
                    <input
                      type='email'
                      id='roomAdminEmail'
                      name='roomAdminEmail'
                      value={roomFormData.roomAdminEmail}
                      onChange={handleRoomFormChange}
                      required
                    />
                  </div>

                  <div className='form-buttons'>
                    <button id='cancel-btn' type='button' onClick={() => setShowRoomForm(false)}>
                      Cancel
                    </button>
                    <button id='submit-btn' type='submit'>Add Room</button>
                  </div>
                </form>
              </div>
            </div>
              )}
            </div>
          </div>
        )}
        <div id='select-space'>
          <select id="area-select" value={areaId} onChange={handleAreaChange}>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.area_name}
            </option>
          ))}
        </select>
        </div>

        <RoomTable areaId={areaId} key={roomsUpdated}/>
        
    </div>
  )
}

export default Rooms