import { Box, Select } from "@chakra-ui/react";
import type { DirectionOption, SortOption } from "../interfaces/options";

interface IRepoFiltersProps {
  sort: SortOption;
  direction: DirectionOption;
  onSortChange: (value: SortOption) => void;
  onDirectionChange: (value: DirectionOption) => void;
}

export default function Filters({
  sort,
  direction,
  onSortChange,
  onDirectionChange,
}: IRepoFiltersProps) {
  return (
    <Box
      display="flex"
      gap={3}
      p={4}
      borderBottom="1px solid"
      borderColor="gray.100"
      flexWrap="wrap"
    >
      <Select
        size="md"
        maxW="200px"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="select-chakra"
      >
        <option value="created">Data de criação</option>
        <option value="updated">Última atualização</option>
        <option value="pushed">Último push</option>
        <option value="full_name">Nome</option>
      </Select>

      <Select
        size="md"
        maxW="200px"
        value={direction}
        onChange={(e) => onDirectionChange(e.target.value as DirectionOption)}
        className="select-chakra"
      >
        <option value="desc">Decrescente</option>
        <option value="asc">Crescente</option>
      </Select>
    </Box>
  );
}
