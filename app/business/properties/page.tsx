import { Metadata } from 'next';
import BusinessPage from '@/app/components/BusinessPage';

export const metadata: Metadata = {
  title: 'Prime Properties | Premium Real Estate Services',
  description: 'Premium real estate services and investment consulting.',
};

export default function PropertiesPage() {
  return (
    <BusinessPage
      title="Prime Properties"
      subtitle="Premium Real Estate Services"
      description="Prime Properties offers comprehensive real estate services including property sales, leasing, and investment consulting for individuals and businesses."
      features={[
        'Residential & Commercial Sales',
        'Property Leasing & Management',
        'Real Estate Investment Consulting',
        'Property Valuation & Appraisal',
        'Market Analysis & Research',
        'Legal & Documentation Support',
      ]}
      stats={[
        { label: 'Properties Sold', value: '1000+' },
        { label: 'Active Listings', value: '500+' },
        { label: 'Investment Value', value: '$500M+' },
      ]}
    />
  );
}

