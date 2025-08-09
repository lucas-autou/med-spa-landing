'use client';

import { useDemoStore } from '@/store/useDemoStore';

export default function DemoProgress() {
  const { currentStep, demoState } = useDemoStore();

  if (demoState !== 'running' || !currentStep?.progress) {
    return null;
  }

  // Parse progress (e.g., "Step 1 of 3")
  const progressMatch = currentStep.progress.match(/Step (\d+) of (\d+)/);
  if (!progressMatch) return null;

  const currentStepNum = parseInt(progressMatch[1]);
  const totalSteps = parseInt(progressMatch[2]);
  const progressPercent = (currentStepNum / totalSteps) * 100;

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* Progress Bar */}
      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-teal h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      {/* Progress Text & Demo Label */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-text-secondary font-medium">
          {currentStep.progress}
        </span>
        <span className="text-teal text-xs bg-teal/10 px-2 py-0.5 rounded-full">
          Demo • no patient data
        </span>
      </div>
    </div>
  );
}