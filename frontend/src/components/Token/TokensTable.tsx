import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowOutIcon from "@mui/icons-material/ArrowOutwardOutlined";

import EmptySection from "@components/common/EmptySection";

import { ITokenInfo, mapTokenStageToLabel } from "../../interfaces";
import AddressInfo from "@components/common/AddressInfo";
import QuantityInfo from "@components/common/QuantityInfo";

interface ITokensTableProps {
  enableActions?: boolean;
  label?: string;
  onClick?: (id: number) => void;
  startIcon?: React.ReactNode;
  tokens: ITokenInfo[];
}

const TokensTable = ({
  enableActions = true,
  label = "Enviar",
  onClick,
  startIcon = <ArrowOutIcon />,
  tokens,
}: ITokensTableProps) => {
  if (tokens.length === 0) {
    return <EmptySection message="No hay tokens en custodia" />;
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Ciudadano</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Estado</TableCell>
            {enableActions && <TableCell align="right">Acción</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {tokens.map((t) => {
            return (
              <TableRow key={t.id} hover>
                <TableCell>{t.name}</TableCell>
                <TableCell>
                  <AddressInfo label="" address={t.creator} />
                </TableCell>
                <TableCell>
                  <QuantityInfo amount={t.totalSupply} />
                </TableCell>
                <TableCell>{mapTokenStageToLabel[t.stage]}</TableCell>
                {enableActions && (
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      startIcon={startIcon}
                      onClick={() => onClick?.(t.id)}
                    >
                      {label}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TokensTable;
