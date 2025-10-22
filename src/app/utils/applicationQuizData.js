// multiplechoice.js

export const multiplechoice = {
  totalPossiblePoints: 40,
  passingScore: 28,
  questions: [
    {
      id: 1,
      question: "Why are you interested in this position?",
      points: 10,
      type: "multiple-choice",
      options: [
        {
          id: 'a',
          text: "I'm passionate about your company's work in AI and this role aligns with my career goals in software development",
          points: 10,
          feedback: "Excellent! Shows research, passion, and alignment."
        },
        {
          id: 'b',
          text: "My skills match the job requirements and I'm looking for new challenges",
          points: 7,
          feedback: "Good answer but could show more company-specific interest."
        },
        {
          id: 'c',
          text: "I'm seeking better compensation and career advancement opportunities",
          points: 4,
          feedback: "Too focused on personal gain. Emphasize mutual value."
        },
        {
          id: 'd',
          text: "A colleague recommended your company as a great place to work",
          points: 3,
          feedback: "Weak. Show independent research and genuine interest."
        }
      ]
    },
    {
      id: 2,
      question: "What are your salary expectations for this role?",
      points: 10,
      type: "multiple-choice",
      options: [
        {
          id: 'a',
          text: "Based on market research, R85,000 - R95,000 monthly, though I'm open to discussion",
          points: 10,
          feedback: "Perfect! Shows research, provides range, and remains flexible."
        },
        {
          id: 'b',
          text: "I'd like to understand the full compensation package before discussing specific figures",
          points: 8,
          feedback: "Professional approach, though a range helps move negotiations forward."
        },
        {
          id: 'c',
          text: "My current salary is R80,000, so I'm looking for at least R90,000",
          points: 5,
          feedback: "Reveals too much. Focus on market value, not current salary."
        },
        {
          id: 'd',
          text: "I'm flexible and willing to accept your standard offer for this position",
          points: 3,
          feedback: "Too passive. Research market rates and communicate your value."
        }
      ]
    },
    {
      id: 3,
      question: "What is your notice period and availability?",
      points: 10,
      type: "multiple-choice",
      options: [
        {
          id: 'a',
          text: "I have a one-month notice period and can start on [specific date]",
          points: 10,
          feedback: "Excellent! Clear, professional, and respects commitments."
        },
        {
          id: 'b',
          text: "I'm currently available and can start immediately",
          points: 8,
          feedback: "Good availability. Be prepared to explain employment gap if applicable."
        },
        {
          id: 'c',
          text: "I need two to three months to properly hand over my current responsibilities",
          points: 6,
          feedback: "Shows professionalism but may be too long for urgent hiring needs."
        },
        {
          id: 'd',
          text: "I can negotiate an earlier start date with my current employer if needed",
          points: 4,
          feedback: "Uncertain timeline. Provide a clear date while mentioning flexibility."
        }
      ]
    },
    {
      id: 4,
      question: "Describe your experience with React and modern JavaScript frameworks.",
      points: 10,
      type: "multiple-choice",
      options: [
        {
          id: 'a',
          text: "I have 3+ years building production applications with React, including hooks, Redux, and comprehensive testing",
          points: 10,
          feedback: "Outstanding! Specific experience with relevant technologies."
        },
        {
          id: 'b',
          text: "I've worked with React for 2 years and am comfortable building components and managing state",
          points: 7,
          feedback: "Good foundation. Consider highlighting specific projects or achievements."
        },
        {
          id: 'c',
          text: "I have 6 months of React experience and primarily work with Angular",
          points: 5,
          feedback: "Honest but limited React experience. Emphasize willingness to learn."
        },
        {
          id: 'd',
          text: "I've completed online React courses and built personal projects",
          points: 3,
          feedback: "Shows initiative but lacks professional experience for senior roles."
        }
      ]
    }
  ]
};

// Helper functions
export const calculateTotalScore = (answers) => {
  return answers.reduce((total, answer) => {
    const question = multiplechoice.questions.find(q => q.id === answer.questionId);
    const option = question?.options.find(opt => opt.id === answer.selectedOptionId);
    return total + (option?.points || 0);
  }, 0);
};

export const getPerformanceLevel = (score) => {
  const percentage = (score / multiplechoice.totalPossiblePoints) * 100;
  
  if (percentage >= 90) return { level: 'Excellent', color: 'green', message: 'Outstanding interview performance!' };
  if (percentage >= 70) return { level: 'Good', color: 'blue', message: 'Strong answers with minor improvements possible.' };
  if (percentage >= 50) return { level: 'Fair', color: 'yellow', message: 'Adequate but needs refinement.' };
  return { level: 'Poor', color: 'red', message: 'Consider preparing more thoroughly.' };
};

export const getFeedback = (answers) => {
  return answers.map(answer => {
    const question = multiplechoice.questions.find(q => q.id === answer.questionId);
    const option = question?.options.find(opt => opt.id === answer.selectedOptionId);
    
    return {
      question: question?.question,
      selectedAnswer: option?.text,
      points: option?.points,
      maxPoints: question?.points,
      feedback: option?.feedback
    };
  });
};

export default multiplechoice;