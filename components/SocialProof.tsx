'use client';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  business: string;
  quote: string;
  avatar: string;
  logo?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Nathalia Florindo',
    role: 'Global HR Project Manager',
    business: 'L’Oréal',
    quote: 'This app is amazing! So good to have these KPIs available automatically',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2', 
    name: 'Mateus Flecha',
    role: 'VP of Audit and Compliance',
    business: 'Fiat',
    quote: 'Well-deserved recognition for an outstanding result',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '3',
    name: 'Marie Lambert',
    role: 'Innovation & Project Manager',
    business: 'Nestlé',
    quote: 'Now we are able to track every single invoice with AI',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '4',
    name: 'Romulo Carmo',
    role: 'Franchising Coordinator',
    business: 'Prudential',
    quote: 'The automated process is being delivered just as planned',
    avatar: 'https://i.pravatar.cc/150?img=8'
  }
];

export default function SocialProof() {
  return (
    <section className="w-full py-12">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Trusted by Industry Leaders
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3 mb-3">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500">
                  {testimonial.role} • {testimonial.business}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 italic">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}