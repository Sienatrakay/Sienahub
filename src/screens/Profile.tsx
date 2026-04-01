import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Image, Text, Button, Spinner } from "@chakra-ui/react";
import { AiOutlineHeart } from "react-icons/ai";
import {
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineLink,
} from "react-icons/hi";
import { FiStar, FiTwitter } from "react-icons/fi";
import { apiURL } from "../utils/api-constant";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
}

export default function Profile() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const PER_PAGE = 4;

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

  const fetchRepos = (pageNumber: number) => {
    if (!user || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    axios
      .get(`${apiURL}/users/${user.login}/repos`, {
        params: { per_page: PER_PAGE, page: pageNumber },
      })
      .then((res) => {
        const newRepos = res.data;
        setRepos((prev) => [...prev, ...newRepos]);
        if (newRepos.length < PER_PAGE) setHasMore(false);
      })
      .catch(() => console.log("error"))
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos(pageRef.current);
  }, []);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingRef.current) {
        pageRef.current += 1;
        fetchRepos(pageRef.current);
      }
    });

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [hasMore, repos]);

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      minHeight="100vh"
      p={{ md: 6 }}
      gap={6}
      maxW="1200px"
      mx="auto"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        bgColor={{ base: "#EADDFF99", md: "white" }}
        p={4}
        color="#4A5568"
        borderRadius={{ md: "sm" }}
        w={{ base: "100%", md: "280px" }}
        minW={{ md: "280px" }}
        alignSelf={{ md: "flex-start" }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Image src={user.avatar_url} borderRadius="full" boxSize="48px" />
          <Box display="flex" flexDirection="column">
            <Text fontSize="xl" fontWeight="bold" color="#171923">
              {user.name}
            </Text>
            <Text fontSize="sm" color="#2D3748">
              @{user.login}
            </Text>
          </Box>
        </Box>
        <Text mt={2}>{user.bio ?? "Esse perfil não adicionou uma bio"}</Text>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Text display="flex" gap={2} alignItems="center" fontSize="sm">
            <HiOutlineUserGroup size={20} /> {user.followers} seguidores
          </Text>
          <Text
            display="flex"
            gap={2}
            alignItems="center"
            fontSize="sm"
            mb={{ md: 4 }}
          >
            <AiOutlineHeart size={20} /> {user.following} seguindo
          </Text>
          <Text display="flex" gap={2} alignItems="center" fontSize="sm">
            <HiOutlineOfficeBuilding size={20} />{" "}
            {user.company ?? "Sem empresa"}
          </Text>
          <Text display="flex" gap={2} alignItems="center" fontSize="sm">
            <HiOutlineLocationMarker size={20} />{" "}
            {user.location ?? "Sem localização"}
          </Text>
          <Text display="flex" gap={2} alignItems="center" fontSize="sm">
            <HiOutlineMail size={20} /> {user.email ?? "Sem email"}
          </Text>
          <Text display="flex" gap={2} alignItems="center" fontSize="sm">
            <HiOutlineLink size={20} />
            <a href={user.blog} target="_blank">
              {user.blog ?? "Sem blog"}
            </a>
          </Text>
          <Text display="flex" gap={2} alignItems="center" fontSize="sm">
            <FiTwitter size={18} />
            {user.twitter_username
              ? `@${user.twitter_username}`
              : "Sem twitter"}
          </Text>
        </Box>
        <Button
          display={{ base: "none", md: "block" }}
          mt={4}
          bg="#8C19D2"
          color="white"
          _hover={{ bg: "purple.700" }}
          onClick={() => navigate("/")}
        >
          Contato
        </Button>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        pb={4}
        bgColor={{ md: "white" }}
        borderRadius={{ md: "sm" }}
      >
        {repos.map((repo) => (
          <Box key={repo.id} className="repos-item">
            <Text fontSize="xl" fontWeight="bold" color="#171923">
              {repo.name}
            </Text>
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

        {hasMore && (
          <Box ref={bottomRef} py={4} display="flex" justifyContent="center">
            {loading && <Spinner color="purple.500" />}
          </Box>
        )}
      </Box>
    </Box>
  );
}
