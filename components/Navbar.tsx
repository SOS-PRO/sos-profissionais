const GOOGLE_FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL;

const Navbar = () => {
  const href = GOOGLE_FORM_URL;
  return (
    <nav
      className="flex justify-between items-center h-16 bg-green-900 text-white relative shadow-sm font-mono"
      role="navigation"
    >
      <a href="/" className="pl-8 font-bold">
        SOS RS - Apoio Profissional
      </a>
      <div className="flex justify-between items-center pr-2 gap-2">
        {/* text wrap for the anchor */}
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="p-2 hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
        >
          + Cadastro de profissional
        </a>
        <button className="p-4 hover:bg-white hover:bg-opacity-20 transition-colors duration-200">
          ⟳
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
