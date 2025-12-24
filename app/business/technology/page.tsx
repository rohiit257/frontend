import { Metadata } from 'next';
import BusinessPage from '@/app/components/BusinessPage';

export const metadata: Metadata = {
  title: 'Technology Solutions | Digital Transformation',
  description: 'Digital transformation and innovative technology solutions.',
};

export default function TechnologyPage() {
  return (
    <BusinessPage
      title="Technology Solutions"
      subtitle="Digital Transformation"
      description="We deliver innovative technology solutions that transform businesses, enhance productivity, and drive digital innovation across industries."
      features={[
        'Software Development & Integration',
        'Cloud Computing Solutions',
        'Mobile App Development',
        'E-commerce Platforms',
        'IoT & Smart Solutions',
        'Technology Consulting',
      ]}
      stats={[
        { label: 'Tech Solutions Delivered', value: '400+' },
        { label: 'Development Team', value: '50+' },
        { label: 'Innovation Projects', value: '100+' },
      ]}
    />
  );
}

