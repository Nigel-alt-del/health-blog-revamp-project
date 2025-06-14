
const IntroSection = () => {
  return (
    <section className="relative py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-indigo-600/5"></div>
      <div className="relative max-w-5xl mx-auto">
        <div className="space-y-6 text-lg leading-relaxed text-gray-700 max-w-4xl mx-auto">
          <p>
            In an increasingly complex healthcare landscape, informed decisions are not just valuable — they're essential. 
            The Health Compass delivers high-quality, data-driven insights tailored to the strategic and operational needs 
            of SME owners, HR managers, directors, and professionals in the private medical insurance sector.
          </p>
          
          <p>
            We go beyond surface-level reporting. Our research is rooted in rigorous analysis, designed to uncover trends, 
            clarify regulatory shifts, and identify actionable opportunities. With our expertly curated intelligence, 
            you'll gain the clarity and confidence needed to navigate challenges, optimise benefits strategies, and stay 
            ahead of industry developments.
          </p>
          
          <p className="text-xl font-medium text-[#20466d] text-center pt-4">
            Let us handle the complexity. You focus on what matters most — your people and your business.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
