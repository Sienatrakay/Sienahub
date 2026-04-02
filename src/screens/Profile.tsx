import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";
import Header from "../components/Header";
import { apiURL } from "../utils/api-constant";
import Filters from "../components/Filters";
import LeftSidebar from "../components/LeftSidebar";
import type { DirectionOption, SortOption } from "../interfaces/options";
import type { IUser } from "../interfaces/IUser";

interface IGitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
  owner: IGitHubRepoOwnerLogin;
}

interface IGitHubRepoOwnerLogin {
  login: string;
}

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();

  const [direction, setDirection] = useState<DirectionOption>("desc");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<IGitHubRepo[]>([]);
  const [sort, setSort] = useState<SortOption>("created");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const user = location.state?.user as IUser;

  const PER_PAGE = 10;

  const timeAgo = (dateString: string): string => {
    const updated = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - updated.getTime();
    const minutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years > 0) return `${years} ano${years > 1 ? "s" : ""}`;
    if (months > 0) return `${months} ${months > 1 ? "meses" : "mês"}`;
    if (days > 0) return `${days} dia${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hora${hours > 1 ? "s" : ""}`;
    return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
  };

  const fetchRepos = useCallback(
    (
      pageNumber: number,
      currentSort: SortOption,
      currentDirection: DirectionOption,
    ) => {
      if (!user || loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      axios
        .get(`${apiURL}/users/${user.login}/repos`, {
          params: {
            per_page: PER_PAGE,
            page: pageNumber,
            sort: currentSort,
            direction: currentDirection,
          },
        })
        .then((res) => {
          const newRepos = res.data;
          setRepos((prev) =>
            pageNumber === 1 ? newRepos : [...prev, ...newRepos],
          );
          if (newRepos.length < PER_PAGE) setHasMore(false);
          else setHasMore(true);
        })
        .catch(() => console.log("error"))
        .finally(() => {
          loadingRef.current = false;
          setLoading(false);
        });
    },
    [user],
  );

  useEffect(() => {
    pageRef.current = 1;
    setRepos([]);
    setHasMore(true);
    fetchRepos(1, sort, direction);
  }, [sort, direction, fetchRepos]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingRef.current && hasMore) {
        pageRef.current += 1;
        fetchRepos(pageRef.current, sort, direction);
      }
    });

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [fetchRepos, hasMore, sort, direction]);

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        minHeight="100vh"
        p={{ md: 6 }}
        gap={6}
        maxW="1200px"
        mx="auto"
      >
        <LeftSidebar user={user} />

        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          pb={4}
          bgColor={{ md: "white" }}
          borderRadius={{ md: "sm" }}
        >
          <Filters
            sort={sort}
            direction={direction}
            onSortChange={setSort}
            onDirectionChange={setDirection}
          />

          {repos.map((repo) => (
            <Box key={repo.id} className="repos-item">
              <a
                href={`https://github.com/${repo.owner.login}/${repo.name}`}
                target="_blank"
              >
                {repo.name}
              </a>
              <Text mt={2}>
                {repo.description ?? "Repositório sem descrição"}
              </Text>
              <Box
                display="flex"
                alignItems="center"
                gap={3}
                mt={2}
                fontSize="sm"
              >
                <Text display="flex" gap={2} alignItems="center">
                  <FiStar size={18} />
                  <span>{repo.stargazers_count}</span>
                </Text>
                <Text>•</Text>
                <Text>Atualizado há {timeAgo(repo.updated_at)}</Text>
              </Box>
            </Box>
          ))}

          <Box ref={bottomRef} py={4} display="flex" justifyContent="center">
            {loading && <Spinner color="purple.500" />}
          </Box>
        </Box>
      </Box>
    </>
  );
}
