"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");

  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  useEffect(() => {
    const getData = async () => {
      if (!input) return setSearchResults(undefined);
      const response = await fetch(`https://fastapi_next.musemy88.workers.dev/api/search?q=${input}`);
      const data = (await response.json()) as {
        results: string[];
        duration: number;
      };
      setSearchResults(data);
    };
    getData();
  }, [input]);
  return (
    <main className="w-screen h-screen">
      <div className="container flex flex-col justify-center items-center gap-5 pt-32 duration-500 animate animate-in fade-in-5 slide-in-from-bottom-2.5">
        <div className="my-4 text-center space-y-2">
          <h1 className="text-4xl font-bold">⚡Speed Search⚡</h1>
          <p className="text-sm text-slate-400 max-w-md">
            Utilizing HonoJs for efficient API handling and Next.js for
            responsive frontend design, this application is deployed seamlessly
            on Cloudflare Workers, offering lightning-fast search capabilities
            with optimized performance and reliability
          </p>
        </div>
        <div className="max-w-md w-full">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search countries ...."
              value={input}
              onValueChange={setInput}
            />
            <CommandList>
              {searchResults?.results.length === 0 ? (
                <CommandEmpty>No result found</CommandEmpty>
              ) : null}
              {searchResults?.results ? (
                <CommandGroup heading="Results">
                  {searchResults?.results.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>

            {searchResults?.results ? (
              <>
                <div className="px-2 py-4 border-t ">
                  <p className="text-xs text-muted-foreground">
                    {searchResults.results.length} results in{" "}
                    {searchResults?.duration.toFixed()} ms{" "}
                  </p>
                </div>
              </>
            ) : null}
          </Command>
        </div>
      </div>
    </main>
  );
}
