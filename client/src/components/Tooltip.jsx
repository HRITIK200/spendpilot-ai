import { HelpCircle } from "lucide-react";

const Tooltip = ({ content }) => {
  return (
    <div className="relative inline-block group ml-1.5 align-middle select-none">
      <HelpCircle size={14} className="text-gray-500 hover:text-gray-350 transition cursor-help" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-52 bg-gray-900/95 border border-gray-800 text-gray-300 text-[10px] leading-normal p-2.5 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 backdrop-blur-md z-30 pointer-events-none text-center font-medium">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-950" />
      </div>
    </div>
  );
};

export default Tooltip;
