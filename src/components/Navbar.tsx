
import { Link } from "react-router-dom";
import { Bitcoin } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-brutalist-black text-white py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
          <Bitcoin className="h-8 w-8 text-brutalist-yellow" />
          <span className="uppercase tracking-wider">CRYPTO BRUTALIST</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-bold uppercase tracking-wider hover:text-brutalist-yellow transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
