const Footer = () => {
  return (
    <footer className="bg-green-900 text-white text-center p-4">
      <span>
        Consulte também o site de abrigos:{" "}
        <a href="https://sos-rs.com/" target="_blank" rel="noreferrer" className="underline">
          SOS-RS
        </a>
      </span>
      <span className="mx-2">•</span>
      <span>
        Projeto Open Source dísponivel em{" "}
        <a
          href="https://github.com/SOS-PRO/sos-profissionais"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          GitHub
        </a>
      </span>
    </footer>
  );
};

export default Footer;
