'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import Chips from './Chips';
import CTAButtons from './CTAButtons';

interface BookingStep {
  id: string;
  title: string;
  question: string;
  options: string[];
  type: 'service' | 'timing' | 'qualification' | 'confirmation';
}

const BOOKING_STEPS: BookingStep[] = [
  {
    id: 'service_selection',
    title: 'Service Selection',
    question: "What treatment are you interested in?",
    options: ['Botox', 'Fillers', 'Laser', 'Facials', 'Other'],
    type: 'service'
  },
  {
    id: 'timing_preference',
    title: 'Timing',
    question: "When would work best for you?",
    options: ['This week', 'Next week', 'I\'m flexible', 'Specific date'],
    type: 'timing'
  },
  {
    id: 'qualification',
    title: 'Quick Questions',
    question: "Any allergies or medical conditions I should know about?",
    options: ['No allergies', 'Yes, I have allergies', 'Pregnant/Nursing', 'Ask me privately'],
    type: 'qualification'
  }
];

interface BookingFlowProps {
  onComplete: (bookingData: any) => void;
  onCancel: () => void;
  initialService?: string;
  className?: string;
}

export default function BookingFlow({
  onComplete,
  onCancel,
  initialService,
  className = ""
}: BookingFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [bookingData, setBookingData] = useState<Record<string, any>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [safetyFlag, setSafetyFlag] = useState(false);

  const { 
    addConversationMessage, 
    setVideoState,
    addSafetyFlag
  } = useDemoStore();

  const currentStep = BOOKING_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === BOOKING_STEPS.length - 1;

  // Set initial service if provided
  useEffect(() => {
    if (initialService) {
      setBookingData({ service_selection: initialService });
      setCurrentStepIndex(1); // Skip to timing
    }
  }, [initialService]);

  const handleStepComplete = (selectedOption: string) => {
    const stepId = currentStep.id;
    
    // Check for safety concerns
    if (stepId === 'qualification' && 
        (selectedOption.includes('allergies') || 
         selectedOption.includes('Pregnant') || 
         selectedOption.includes('Nursing'))) {
      setSafetyFlag(true);
      addSafetyFlag('booking_qualification_concern');
      
      // Add messages for safety redirect
      addConversationMessage('user', selectedOption);
      setTimeout(() => {
        addConversationMessage(
          'ai', 
          "I'd love to connect you with our specialist for a quick consult. They'll ensure the perfect treatment plan for you."
        );
        setVideoState('talking_empathetic');
      }, 500);
      
      return;
    }

    // Store the selection
    const newBookingData = {
      ...bookingData,
      [stepId]: selectedOption
    };
    setBookingData(newBookingData);

    // Add conversation messages
    addConversationMessage('user', selectedOption);
    
    if (isLastStep) {
      // Show confirmation
      setShowConfirmation(true);
      setTimeout(() => {
        addConversationMessage(
          'ai', 
          generateConfirmationMessage(newBookingData)
        );
        setVideoState('talking_animated');
      }, 500);
    } else {
      // Move to next step
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        const nextStep = BOOKING_STEPS[currentStepIndex + 1];
        addConversationMessage('ai', nextStep.question);
        setVideoState('talking_neutral');
      }, 500);
    }
  };

  const generateConfirmationMessage = (data: Record<string, any>) => {
    const service = data.service_selection || 'your treatment';
    const timing = data.timing_preference || 'soon';
    
    return `Perfect! I'll book you for ${service.toLowerCase()} ${
      timing.toLowerCase().includes('week') ? timing.toLowerCase() : 'at your preferred time'
    }. Let me check our availability.`;
  };

  const generateTimeSlots = () => {
    const timing = bookingData.timing_preference;
    
    if (timing === 'This week') {
      return ['Thursday 2:30 PM', 'Friday 5:10 PM', 'Saturday 10:00 AM'];
    } else if (timing === 'Next week') {
      return ['Monday 1:00 PM', 'Wednesday 3:30 PM', 'Friday 4:00 PM'];
    } else {
      return ['This Thursday 2:30 PM', 'Next Monday 1:00 PM', 'I\'ll call to schedule'];
    }
  };

  const handleTimeSlotSelection = (slot: string) => {
    const finalBookingData = {
      ...bookingData,
      time_slot: slot
    };

    // Add user message
    addConversationMessage('user', slot);

    // Simulate booking confirmation
    setTimeout(() => {
      setVideoState('talking_animated');
      addConversationMessage(
        'ai',
        `Excellent! You're booked for ${bookingData.service_selection} on ${slot}. I'll send confirmation details right away.`
      );
      
      // Show success animation
      setTimeout(() => {
        onComplete(finalBookingData);
      }, 2000);
    }, 500);
  };

  const handleSafetyConsult = () => {
    onComplete({
      ...bookingData,
      requiresConsult: true,
      safetyFlag: true
    });
  };

  // Safety flag view
  if (safetyFlag) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-yellow-500 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Specialist Consultation Recommended
              </h3>
              <p className="text-yellow-700 mb-4">
                Based on your responses, our specialist will ensure you receive the safest and most effective treatment.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSafetyConsult}
                  className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-hover transition-colors"
                >
                  Schedule Specialist Consult
                </button>
                <button
                  onClick={() => {
                    setSafetyFlag(false);
                    setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
                  }}
                  className="px-4 py-2 border border-gray-200 text-text-primary rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Modify My Responses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Time slot selection view
  if (showConfirmation && !safetyFlag) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white border border-border-light rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-4 mb-6">
            <Calendar className="text-teal flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-text-primary mb-1">
                Choose Your Time Slot
              </h3>
              <p className="text-text-secondary text-sm">
                Available times for {bookingData.service_selection} {bookingData.timing_preference?.toLowerCase()}
              </p>
            </div>
          </div>

          <Chips
            options={generateTimeSlots()}
            onSelect={handleTimeSlotSelection}
            className="mb-4"
          />

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <button
                onClick={onCancel}
                className="text-text-tertiary text-sm hover:text-teal transition-colors"
              >
                ← Back to modify selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main booking flow
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-text-primary">
          Book Your Appointment
        </h3>
        <div className="flex items-center gap-2">
          {BOOKING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStepIndex ? 'bg-teal' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current step */}
      <div className="bg-white border border-border-light rounded-xl p-6 shadow-md">
        <div className="flex items-start gap-4 mb-4">
          {currentStep.type === 'service' && <Calendar className="text-teal" size={20} />}
          {currentStep.type === 'timing' && <Clock className="text-teal" size={20} />}
          {currentStep.type === 'qualification' && <CheckCircle className="text-teal" size={20} />}
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-text-primary">
                {currentStep.title}
              </h4>
              <span className="text-xs text-text-tertiary">
                Step {currentStepIndex + 1} of {BOOKING_STEPS.length}
              </span>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              {currentStep.question}
            </p>
          </div>
        </div>

        <Chips
          options={currentStep.options}
          onSelect={handleStepComplete}
          className="mb-4"
        />

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              if (currentStepIndex > 0) {
                setCurrentStepIndex(currentStepIndex - 1);
              } else {
                onCancel();
              }
            }}
            className="text-text-tertiary text-sm hover:text-teal transition-colors"
          >
            ← Back
          </button>
          
          <button
            onClick={onCancel}
            className="text-text-tertiary text-sm hover:text-red-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Context info */}
      {Object.keys(bookingData).length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <h5 className="text-xs font-medium text-text-secondary mb-2">
            Your Selections:
          </h5>
          <div className="space-y-1">
            {Object.entries(bookingData).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-text-tertiary capitalize">
                  {key.replace('_', ' ')}:
                </span>
                <span className="text-text-primary font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}