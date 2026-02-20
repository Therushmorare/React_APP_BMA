import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, Clock, User, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const InterviewDetailsModal = ({ interview, onClose, onAction }) => {

  // ====== Employee ID ======
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("user_id");
    if (id) setEmployeeId(id);
  }, []);

  //fixes
  const [activeTab, setActiveTab] = useState('details');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(interview.date));
  const [selectedTime, setSelectedTime] = useState(interview.time);
  const [notes, setNotes] = useState(interview.notes || '');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false); // 🔹 Loading for reschedule

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Rescheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
  };

  const handlePrevMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  const handleNextMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  const handleDateSelect = (day) => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));

  const handleReschedule = async () => {
    if (loading) return; // Prevent multiple clicks

    const token = sessionStorage.getItem("access_token");
    if (!token) return alert("Session expired. Please log in again.");
    if (!selectedDate || !selectedTime) return alert("Please select both a date and time.");

    const formattedDate = selectedDate.toISOString().split("T")[0];

    try {
      setLoading(true);

      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/rescheduleInterview/${employeeId}/${interview.candidateId}/${interview.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employee_id: employeeId,
            candidate_id: interview.candidateId,
            interview_id: interview.id,
            date: formattedDate,
            time: selectedTime,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log("Interview rescheduled:", data);

      onAction(interview.id, "reschedule", { date: formattedDate, time: selectedTime });
      setShowCalendar(false);
      onClose();

    } catch (error) {
      console.error("Reschedule error:", error);
      alert("Failed to reschedule interview.");
    } finally {
      setLoading(false);
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const timeSlots = [
    '08:00','08:30','09:00','09:30','10:00','10:30',
    '11:00','11:30','12:00','12:30','13:00','13:30',
    '14:00','14:30','15:00','15:30','16:00','16:30','17:00'
  ];

  return (
    <div className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Interview Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Section */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
              <img
                src={interview.avatar}
                alt={interview.name}
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(interview.name)}&background=22c55e&color=ffffff&size=128`}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{interview.name}</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getStatusColor(interview.status)}`}>
              {interview.status}
            </span>
            <p className="text-gray-600 font-medium">{interview.position}</p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <Mail size={16} className="text-gray-500" />
              <span className="text-gray-700">{interview.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone size={16} className="text-gray-500" />
              <span className="text-gray-700">{interview.phone}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-0">
              {['details'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'details' ? 'Interview Details' : 'Evaluation'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Date', icon: Calendar, value: new Date(interview.date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric'}) },
                    { label: 'Time', icon: Clock, value: interview.time },
                    { label: 'Interviewer', icon: User, value: interview.interviewer },
                    { label: 'Type', icon: User, value: interview.type }
                  ].map((item,i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <item.icon size={16} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">{item.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Reschedule */}
                {!showCalendar ? (
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-700 hover:bg-green-50 transition-colors"
                  >
                    <Calendar size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Reschedule Interview</span>
                  </button>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Select New Date & Time</h4>
                      <button onClick={() => setShowCalendar(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={16} />
                      </button>
                    </div>

                    {/* Calendar */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 rounded"><ChevronLeft size={20} /></button>
                        <h3 className="font-semibold text-gray-900">{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h3>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-200 rounded"><ChevronRight size={20} /></button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">{day}</div>)}
                        {Array.from({ length: startingDayOfWeek }).map((_,i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_,i) => {
                          const day = i+1;
                          const isSelected = selectedDate.getDate()===day;
                          const isToday = new Date().toDateString() === new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day).toDateString();
                          return (
                            <button key={day} onClick={()=>handleDateSelect(day)} className={`p-2 text-sm rounded ${isSelected?'bg-green-700 text-white':isToday?'bg-blue-100 text-blue-800':'hover:bg-gray-200'}`}>
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                        {timeSlots.map(time => (
                          <button
                            key={time}
                            onClick={()=>setSelectedTime(time)}
                            className={`px-3 py-2 text-sm rounded border ${selectedTime===time?'bg-green-700 text-white border-green-700':'border-gray-300 hover:bg-gray-100'}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Confirm Reschedule */}
                    <button
                      onClick={handleReschedule}
                      disabled={loading}
                      className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      {loading && <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>}
                      <span>{loading?'Rescheduling...':'Confirm Reschedule'}</span>
                    </button>
                  </div>
                )}

                {/* Notes */}
                {interview.notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-600 text-sm">{interview.notes}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
      </div>
    </div>
  );
};

export default InterviewDetailsModal;