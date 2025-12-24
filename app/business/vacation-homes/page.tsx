import { Metadata } from 'next';
import BusinessPage from '@/app/components/BusinessPage';

export const metadata: Metadata = {
  title: 'Vacation Homes | Luxury Vacation Rentals',
  description: 'Luxury vacation rentals and holiday property management.',
};

export default function VacationHomesPage() {
  return (
    <BusinessPage
      title="Vacation Homes"
      subtitle="Luxury Vacation Rentals"
      description="Experience luxury and comfort with our premium vacation home rentals. We offer exceptional properties in prime locations with world-class amenities."
      features={[
        'Luxury Property Rentals',
        'Prime Location Properties',
        'Full Property Management',
        '24/7 Guest Support',
        'Premium Amenities',
        'Concierge Services',
      ]}
      stats={[
        { label: 'Properties Available', value: '200+' },
        { label: 'Happy Guests', value: '10K+' },
        { label: 'Average Rating', value: '4.9/5' },
      ]}
    />
  );
}

