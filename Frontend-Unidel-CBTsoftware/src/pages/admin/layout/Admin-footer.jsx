import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#072146] text-white body-font">
      <div className="container px-5 py-4 mx-auto flex items-center justify-between flex-col sm:flex-row">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L2 7l10 5 10-5-10-5z" />
            </svg>
          </div>
          <span className="ml-3 text-xl font-semibold">UNIDEL</span>
        </div>

        <p className="text-sm text-slate-300 sm:ml-4 sm:pl-4 sm:border-l sm:border-slate-700 sm:py-2 sm:mt-0 mt-4">
          © {new Date().getFullYear()} UNIDEL — <span className="text-slate-300 ml-1">Secure CBT Platform</span>
        </p>

        <div className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start space-x-4">
          <a className="text-slate-300 hover:text-white">Facebook</a>
          <a className="text-slate-300 hover:text-white">Twitter</a>
          <a className="text-slate-300 hover:text-white">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;