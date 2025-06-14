
const IntroSection = () => {
  return (
    <section className="relative py-8 px-4 bg-cover bg-center bg-no-repeat min-h-[200px]" style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('/lovable-uploads/80089a9e-ad3b-4f90-bf3d-a3a94498537d.png')`
    }}>
      <div className="relative max-w-4xl mx-auto">
        <div className="space-y-4 text-base leading-relaxed text-gray-700 max-w-3xl mx-auto">
          <p>
            In today's complex healthcare landscape, informed decisions are essential. The Health Compass delivers 
            data-driven insights tailored for SME owners, HR managers, and private medical insurance professionals.
          </p>
          
          <p>
            Our research goes beyond surface-level reporting — we uncover trends, clarify regulatory shifts, 
            and identify actionable opportunities to help you navigate challenges and optimize benefits strategies.
          </p>
          
          <p className="text-lg font-medium text-[#20466d] text-center pt-2">
            Let us handle the complexity. You focus on your people and your business.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
