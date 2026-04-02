import { useNavigate } from "react-router-dom";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { AiOutlineHeart } from "react-icons/ai";
import { FiTwitter } from "react-icons/fi";
import {
  HiOutlineLink,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
} from "react-icons/hi";
import type { IUser } from "../interfaces/IUser";

export default function LeftSidebar({ user }: { user: IUser }) {
  const navigate = useNavigate();

  return (
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
          <HiOutlineOfficeBuilding size={20} /> {user.company ?? "Sem empresa"}
        </Text>
        <Text display="flex" gap={2} alignItems="center" fontSize="sm">
          <HiOutlineLocationMarker size={20} />{" "}
          {user.location ?? "Sem localização"}
        </Text>
        <Text display="flex" gap={2} alignItems="center" fontSize="sm">
          <HiOutlineMail size={20} />
          {user.email ? (
            <a href={`mailto:${user.email}`}>{user.email}</a>
          ) : (
            "Sem email"
          )}
        </Text>
        <Text display="flex" gap={2} alignItems="center" fontSize="sm">
          <HiOutlineLink size={20} />
          {user.blog ? (
            <a href={user.blog} target="_blank">
              {user.blog}
            </a>
          ) : (
            "Sem blog"
          )}
        </Text>
        <Text display="flex" gap={2} alignItems="center" fontSize="sm">
          <FiTwitter size={18} />
          {user.twitter_username ? (
            <a href={`https://x.com/${user.twitter_username}`} target="_blank">
              @{user.twitter_username}
            </a>
          ) : (
            "Sem twitter"
          )}
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
  );
}
