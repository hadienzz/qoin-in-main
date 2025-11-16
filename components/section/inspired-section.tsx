import PageContainer from "../shared/page-container";
import ProductSection from "../shared/product-section";
import Section from "../shared/section";

const InspiratedSection = () => {
  return (
    <Section>
      <PageContainer>
        <ProductSection
          title="Inspirasi Buat Kamu"
          description="Inspirasi, rekomendasi, dan hal-hal seru buat kamu"
          isInspirated
        />
      </PageContainer>
    </Section>
  );
};

export default InspiratedSection;
