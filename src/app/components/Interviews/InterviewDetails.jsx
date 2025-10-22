import React, { useState } from 'react';
import { X, Mail, Phone, FileText, Calendar, Clock, User, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const InterviewDetailsModal = ({ interview, onClose, onAction }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(interview.date));
  const [selectedTime, setSelectedTime] = useState(interview.time);
  const [notes, setNotes] = useState(interview.notes || '');
  const [rating, setRating] = useState(0);

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
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleReschedule = () => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log('Rescheduling interview to:', formattedDate, selectedTime);
    onAction(interview.id, 'reschedule', { date: formattedDate, time: selectedTime });
    setShowCalendar(false);
    onClose();
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const applicationData = [
    { question: "Why are you interested in this position?", answer: "I'm passionate about software development and have been following your company's innovative work. This role aligns perfectly with my career goals." },
    { question: "What are your salary expectations?", answer: "R85,000 - R95,000 monthly, depending on benefits and growth opportunities." },
    { question: "When can you start?", answer: "I can start within 2 weeks notice period." },
    { question: "Do you have relevant experience?", answer: "Yes, I have 3+ years of experience in this field with proven track record." }
  ];

  return (
    <>
      {/* Sliding Panel */}
      <div className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Interview Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
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
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(interview.name)}&background=22c55e&color=ffffff&size=128`;
                  }}
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
                {[
                  { id: 'details', label: 'Interview Details' },
                  { id: 'application', label: 'Application' },
                  { id: 'evaluation', label: 'Evaluation' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-700 text-green-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* Interview Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">Date</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(interview.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock size={16} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">Time</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{interview.time}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <User size={16} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">Interviewer</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{interview.interviewer}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <User size={16} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">Type</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{interview.type}</p>
                    </div>
                  </div>

                  {/* Reschedule Section */}
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
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Select New Date & Time</h4>
                        <button
                          onClick={() => setShowCalendar(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Calendar */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 rounded">
                            <ChevronLeft size={20} />
                          </button>
                          <h3 className="font-semibold text-gray-900">
                            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                          </h3>
                          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-200 rounded">
                            <ChevronRight size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                              {day}
                            </div>
                          ))}
                          
                          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                            <div key={`empty-${i}`} />
                          ))}
                          
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isSelected = selectedDate.getDate() === day;
                            const isToday = new Date().toDateString() === new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day).toDateString();
                            
                            return (
                              <button
                                key={day}
                                onClick={() => handleDateSelect(day)}
                                className={`p-2 text-sm rounded ${
                                  isSelected 
                                    ? 'bg-green-700 text-white' 
                                    : isToday
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'hover:bg-gray-200'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Time
                        </label>
                        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`px-3 py-2 text-sm rounded border ${
                                selectedTime === time
                                  ? 'bg-green-700 text-white border-green-700'
                                  : 'border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleReschedule}
                        className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors font-medium"
                      >
                        Confirm Reschedule
                      </button>
                    </div>
                  )}

                  {interview.notes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                      <p className="text-gray-600 text-sm">{interview.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Application Tab */}
              {activeTab === 'application' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Application Questions</h4>
                  {applicationData.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-800 mb-2">{item.question}</p>
                      <p className="text-gray-600 text-sm">{item.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Evaluation Tab */}
              {activeTab === 'evaluation' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                      placeholder="Add your evaluation notes here..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`p-1 transition-colors ${
                            star <= rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          <Star size={20} fill={star <= rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {rating > 0 ? `${rating}/5` : 'No rating'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Documents</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.open(interview.resumeUrl, '_blank')}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText size={16} className="text-green-700" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Resume/CV</p>
                    <p className="text-xs text-gray-500">resume.pdf</p>
                  </div>
                </button>
                
                <button
                  onClick={() => console.log('Download documents')}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText size={16} className="text-green-700" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Cover Letter</p>
                    <p className="text-xs text-gray-500">cover-letter.pdf</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onAction(interview.id, 'complete');
                  onClose();
                }}
                disabled={interview.status === 'Completed'}
                className="flex-1 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark Complete
              </button>
              <button
                onClick={() => {
                  onAction(interview.id, 'cancel');
                  onClose();
                }}
                disabled={interview.status === 'Completed' || interview.status === 'Cancelled'}
                className="flex-1 border border-red-300 text-red-700 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewDetailsModal;