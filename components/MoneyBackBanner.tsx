'use client';

import { CheckCircle } from 'lucide-react';

export default function MoneyBackBanner() {
  return (
    <section className="w-full py-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium text-gray-900">
            Try Sarah for 14 days — Keep all the leads, or get 100% back.
          </p>
        </div>
      </div>
    </section>
  );
}