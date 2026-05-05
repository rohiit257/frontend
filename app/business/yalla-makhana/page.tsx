import { Metadata } from 'next';
import BusinessPage from '@/app/components/BusinessPage';

export const metadata: Metadata = {
  title: 'Yalla Makhana | Flavored Foxnut Snacks',
  description: 'UAE-focused flavored makhana snack brand with ready-to-retail product variants.',
};

export default function YallaMakhanaPage() {
  return (
    <BusinessPage
      title="Yalla Makhana"
      subtitle="Flavored Makhana Snacks"
      description="Yalla Makhana is a UAE-facing packaged snack brand centered on foxnuts, offering a flavor-forward portfolio designed for modern retail shelves, grocery channels, and direct consumer discovery."
      features={[
        'Ready-to-retail makhana snack portfolio for UAE consumers',
        'Signature flavors including Za\'atar, Peri Peri, Spanish Tomato, Lime & Mint, and Labneh & Mint',
        'Additional variants such as Cream & Onion, Cheese & Herbs, and Himalayan Salt & Pepper',
        'Suitable for grocery retail, convenience formats, and snack merchandising',
        'Product-led consumer brand positioned for channel and retail expansion',
        'Dubai-based market presence with local delivery and contact channels',
      ]}
      stats={[
        { label: 'Signature Flavors', value: '9+' },
        { label: 'Core Product', value: 'Makhana' },
        { label: 'Market Base', value: 'Dubai' },
      ]}
    />
  );
}
