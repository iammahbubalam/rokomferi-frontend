import { InfoPage } from "@/components/layout/InfoPage";

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping & Returns" subtitle="Our Commitment to You">
      <h3>Shipping Policy</h3>
      <p>
        We offer complimentary express shipping on all orders within Dhaka city. For nationwide delivery, a standard flat rate applies. International shipping is calculated at checkout based on destination and weight.
      </p>
      <ul>
        <li>**Dhaka City**: 24-48 hours</li>
        <li>**Nationwide**: 3-5 business days</li>
        <li>**International**: 7-14 business days</li>
      </ul>

      <h3>Returns & Exchanges</h3>
      <p>
        We accept returns for exchange within 7 days of delivery, provided the item is unworn, unwashed, and the original security tag is intact. Please note that sale items and customized orders are final sale.
      </p>
      <p>
        To initiate a return, please contact our concierge at returns@rokomferi.com with your order number.
      </p>
    </InfoPage>
  );
}
