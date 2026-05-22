import { Metadata } from 'next';
import BusinessPage from '@/app/components/BusinessPage';

export const metadata: Metadata = {
  title: 'Wings9 Properties LLC | Premium Real Estate Services',
  description: 'Premium real estate services and investment consulting.',
};

export default function PropertiesPage() {
  return (
    <BusinessPage
      title="Wings9 Properties LLC"
      subtitle="Premium Real Estate Services"
      description="Wings9 Properties LLC offers comprehensive real estate services including property sales, leasing, and investment consulting for individuals and businesses."
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

