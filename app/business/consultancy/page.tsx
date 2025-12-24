import { Metadata } from 'next';
import BusinessPage from '@/app/components/BusinessPage';

export const metadata: Metadata = {
  title: 'Consultancy Services | Strategic Business Consulting',
  description: 'Strategic business consulting for international expansion and growth.',
};

export default function ConsultancyPage() {
  return (
    <BusinessPage
      title="Consultancy Services"
      subtitle="Strategic Business Consulting"
      description="Our consultancy services provide expert guidance for businesses seeking to expand internationally, optimize operations, and achieve sustainable growth."
      features={[
        'International Market Entry Strategies',
        'Business Process Optimization',
        'Financial Planning & Analysis',
        'Organizational Development',
        'Risk Management & Compliance',
        'Growth Strategy Development',
      ]}
      stats={[
        { label: 'Consulting Projects', value: '300+' },
        { label: 'Countries Served', value: '50+' },
        { label: 'Client Success Rate', value: '95%' },
      ]}
    />
  );
}

