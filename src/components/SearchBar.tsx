"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CaseUpper } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { ExtendedPost } from "@/types/db";
import React from "react";
import Link from "next/link";

// Define types for post and user results
interface PostResult {
  id: string;
  title: string;
}

interface UserResult {
  id: string;
  username: string;
  // Add other user properties as needed
}

export const SearchBar = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<{
    posts: PostResult[];
    users: UserResult[];
  }>({
    posts: [],
    users: [],
  });

  const request = debounce(async () => {
    await refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const {
    data: queryResult,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return { posts: [], users: [] };
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data;
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  useEffect(() => {
    if (queryResult) {
      setSearchResults(queryResult);
    }
  }, [queryResult]);

  const commandRef = useRef(null);

  useOnClickOutside(commandRef, () => {
    setInput("");
    setSearchResults({ posts: [], users: [] });
  });

  return (
    <Command
      ref={commandRef}
      className={`relative rounded-lg  z-50 overflow-visible bg-deep-champagne`}
    >
      <CommandInput
        isLoading={isFetching}
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="search posts or users"
      />

      {input.length > 0 ? (
        <CommandList className="absolute bg-deep-champagne top-full inset-x-0 shadow rounded-b-md">
          {searchResults.posts.length > 0 || searchResults.users.length > 0 ? (
            <React.Fragment>
              {searchResults.posts.length > 0 && (
                <CommandGroup heading="Posts">
                  {searchResults.posts.map((post) => (
                    <CommandItem
                      key={post.id}
                      value={post.title}
                      className="hover:bg-primary bg-white"
                    >
                      <CaseUpper className="mr-2 h-4 w-4" />
                      <Link href={`/post/${post.id}`}>{post.title} / </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.users.length > 0 && (
                <CommandGroup heading="Users">
                  {searchResults.users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.username}
                      className="hover:bg-primary-colour"
                    >
                      {/* Render user information */}
                      <a href={`/profile/${user.id}`}>{user.username}</a>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </React.Fragment>
          ) : (
            <CommandGroup>
              <CommandItem>No posts or users found.</CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      ) : null}
    </Command>
  );
};
