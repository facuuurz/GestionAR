"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; 

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    // Se eliminaron las clases: focus-within:ring-2 ring-[#135bec]
    <label className="flex w-full h-11 items-center rounded-lg bg-[#f0f2f4] dark:bg-gray-800 px-3 overflow-hidden transition-all">
      <span className="material-symbols-outlined text-[#616f89] dark:text-gray-400 text-[22px]">
        search
      </span>
      <input
        className="w-full bg-transparent border-none outline-none text-[#111318] dark:text-white placeholder-[#616f89] dark:placeholder-gray-500 text-sm ml-2 h-full"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        type="text"
      />
    </label>
  );
}