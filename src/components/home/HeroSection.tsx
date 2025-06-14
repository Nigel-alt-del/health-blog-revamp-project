
interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const HeroSection = ({ title, subtitle, backgroundImage }: HeroSectionProps) => {
  return (
    <section 
      className="relative py-24 px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(32, 70, 109, 0.8), rgba(32, 70, 109, 0.8)), url('${backgroundImage}')`
      }}
    >
      <div className="max-w-5xl mx-auto text-center text-white">
        <h1 className="text-5xl font-bold mb-8 leading-tight">
          {title.split(' ').map((word, index) => 
            word === 'Reports' ? (
              <span key={index} className="text-[#22aee1]">{word}</span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
        </h1>
        <div className="text-lg leading-relaxed opacity-95 space-y-4 max-w-4xl mx-auto">
          {subtitle.split('\n\n').map((paragraph, index) => (
            <p key={index} className={index === 0 ? "text-xl font-medium text-[#22aee1] mb-6" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
