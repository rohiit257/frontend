import { Metadata } from 'next';
import BusinessPage from '@/app/components/BusinessPage';

export const metadata: Metadata = {
  title: 'Wings9 Technologies | Enterprise Solutions',
  description: 'Leading technology solutions and digital transformation services.',
};

export default function Wings9Page() {
  return (
    <BusinessPage
      title="Wings9 Technologies"
      subtitle="Leading Enterprise Solutions"
      description="Wings9 Technologies is at the forefront of digital transformation, providing cutting-edge technology solutions that drive business growth and innovation."
      features={[
        'Enterprise Software Development',
        'Cloud Infrastructure & Migration',
        'AI & Machine Learning Solutions',
        'Cybersecurity & Data Protection',
        'Digital Strategy Consulting',
        'Custom Application Development',
      ]}
      stats={[
        { label: 'Projects Completed', value: '500+' },
        { label: 'Global Clients', value: '200+' },
        { label: 'Years of Experience', value: '15+' },
      ]}
    />
  );
}

