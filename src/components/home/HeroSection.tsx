
interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const HeroSection = ({ title, subtitle, backgroundImage }: HeroSectionProps) => {
  return (
    <section 
      className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(32, 70, 109, 0.8), rgba(32, 70, 109, 0.8)), url('${backgroundImage}')`
      }}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          {title.split(' ').map((word, index) => 
            word === 'Reports' ? (
              <span key={index} className="text-[#22aee1]">{word}</span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
