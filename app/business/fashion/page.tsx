import { Metadata } from 'next';
import BusinessPage from '@/app/components/BusinessPage';

export const metadata: Metadata = {
  title: 'Fashion Brands | Premium Fashion & Lifestyle',
  description: 'Premium fashion brands and lifestyle products.',
};

export default function FashionPage() {
  return (
    <BusinessPage
      title="Fashion Brands"
      subtitle="Premium Fashion & Lifestyle"
      description="Our fashion division represents premium brands and lifestyle products, offering curated collections that define elegance and sophistication."
      features={[
        'Premium Brand Portfolio',
        'Luxury Fashion Retail',
        'E-commerce Fashion Platform',
        'Brand Development & Marketing',
        'Fashion Consulting Services',
        'Lifestyle Product Lines',
      ]}
      stats={[
        { label: 'Brand Partners', value: '50+' },
        { label: 'Product Lines', value: '200+' },
        { label: 'Global Reach', value: '30+' },
      ]}
    />
  );
}

