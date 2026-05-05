import { Metadata } from 'next';
import BusinessPage from '@/app/components/BusinessPage';

export const metadata: Metadata = {
  title: 'Wings9 Global Trading | Food Export and GCC Distribution',
  description: 'Dubai-based food export, sourcing, logistics, and GCC distribution services.',
};

export default function GlobalTradingPage() {
  return (
    <BusinessPage
      title="Wings9 Global Trading"
      subtitle="Food Export and Trade Management"
      description="Wings9 Global Trading is a Dubai-based food export business focused on sourcing authentic Indian grocery products and moving them efficiently into UAE, GCC, and wider international markets through a quality-led supply chain."
      features={[
        'Food export across UAE, GCC, and international markets',
        'Customized sourcing for bulk buyers and channel partners',
        'Quality assurance aligned with international food standards',
        'Price negotiation backed by supplier and market relationships',
        'Logistics, documentation, packaging, and shipping coordination',
        'Portfolio covering foxnuts, tea, namkeen, sweets, spices, cookies, protein bars, and frozen food',
      ]}
      stats={[
        { label: 'Containers Exported', value: '208+' },
        { label: 'Territories Covered', value: '92+' },
        { label: 'Yearly Growth', value: '50%' },
      ]}
    />
  );
}
