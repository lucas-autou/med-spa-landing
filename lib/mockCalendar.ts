// Mock calendar system for booking simulation
// Generates realistic slots for current week

export interface TimeSlot {
  id: string;
  day: string;
  date: string;
  time: string;
  displayTime: string;
  available: boolean;
}

export interface BookingData {
  firstName: string;
  phone: string;
  service: string;
  slot: TimeSlot;
  bookingId: string;
}

export interface ExistingBooking {
  bookingId: string;
  service: string;
  slot: TimeSlot;
  clientName: string;
}

// Generate this week's slots
function generateWeeklySlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();
  
  // Get current week dates (skip weekends for med spa)
  const weekdays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Only include weekdays (Mon-Fri)
    if (date.getDay() >= 1 && date.getDay() <= 5) {
      weekdays.push(date);
    }
  }

  // Time slots for each day
  const dailySlots = [
    { time: '10:20', display: '10:20 AM' },
    { time: '11:30', display: '11:30 AM' },
    { time: '13:40', display: '1:40 PM' },
    { time: '14:30', display: '2:30 PM' },
    { time: '15:45', display: '3:45 PM' },
    { time: '17:10', display: '5:10 PM' },
  ];

  weekdays.forEach((date, dayIndex) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    dailySlots.forEach((slot, slotIndex) => {
      // Make some slots unavailable for realism
      const isAvailable = !(dayIndex === 0 && slotIndex < 2) && // Past slots on first day
                         !(dayIndex === 2 && slotIndex === 3) && // Random unavailable
                         !(dayIndex === 3 && slotIndex === 1);   // Random unavailable
      
      slots.push({
        id: `${dayIndex}-${slotIndex}`,
        day: dayName,
        date: dateStr,
        time: slot.time,
        displayTime: slot.display,
        available: isAvailable
      });
    });
  });

  return slots;
}

// Get available slots for booking
export function getAvailableSlots(): TimeSlot[] {
  return generateWeeklySlots().filter(slot => slot.available);
}

// Get specific slots for demo (always show Thu 2:30 PM and 5:10 PM)
export function getDemoSlots(): TimeSlot[] {
  const allSlots = generateWeeklySlots();
  
  // Find Thursday slots
  const thursdaySlots = allSlots.filter(slot => 
    slot.day === 'Thursday' && 
    (slot.time === '14:30' || slot.time === '17:10')
  );
  
  // Fallback to any two available slots if Thursday not available
  if (thursdaySlots.length < 2) {
    return getAvailableSlots().slice(0, 2);
  }
  
  return thursdaySlots;
}

// Simulate booking process
export async function simulateBooking(
  slot: TimeSlot,
  firstName: string,
  phone: string,
  service: string = 'Botox'
): Promise<BookingData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const bookingId = `BK${Date.now().toString().slice(-6)}`;
  
  return {
    firstName,
    phone,
    service,
    slot,
    bookingId
  };
}

// Mock existing booking for reschedule demo
export function getMockExistingBooking(): ExistingBooking {
  const allSlots = generateWeeklySlots();
  const fridaySlot = allSlots.find(slot => 
    slot.day === 'Friday' && slot.time === '10:20'
  );
  
  return {
    bookingId: 'BK892401',
    service: 'Botox consultation',
    slot: fridaySlot || allSlots[0], // Fallback to first slot
    clientName: 'Sarah'
  };
}

// Get reschedule options (exclude current slot)
export function getRescheduleOptions(currentSlotId: string): TimeSlot[] {
  return getAvailableSlots()
    .filter(slot => slot.id !== currentSlotId)
    .slice(0, 2); // Show only 2 options for simplicity
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return as-is if not 10 digits
}

// Validation helpers
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && /^[a-zA-Z\s-']+$/.test(name.trim());
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
}