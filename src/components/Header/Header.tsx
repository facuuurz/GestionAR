const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#ededed] dark:border-[#333] bg-background-light dark:bg-background-dark px-10 py-3 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-primary dark:text-white">
          <div className="size-8 flex items-center justify-center rounded-lg bg-primary text-white dark:bg-white dark:text-primary">
            <span className="material-symbols-outlined text-[20px]">sunny</span>
          </div>
          <h2 className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">GestionAR</h2>
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
        <div className="hidden md:flex items-center gap-9">
          <a className="text-primary dark:text-white text-sm font-bold leading-normal border-b-2 border-primary dark:border-white pb-0.5" href="#">Panel</a>
          <a className="text-neutral-500 dark:text-neutral-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-white transition-colors" href="#">Historial</a>
          <a className="text-neutral-500 dark:text-neutral-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-white transition-colors" href="#">Configuraciones</a>
        </div>
      </div>
    </header>
  );
};

export default Header;