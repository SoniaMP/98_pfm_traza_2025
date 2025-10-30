import {
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { formatAddress } from "@utils/helpers";
import {
  AccountStatus,
  IAccountInfo,
  mapRoleToLabel,
  mapStatusToLabel,
} from "../../interfaces";
import UserActions from "./UserActions";

const UsersTable = ({
  accounts,
  onApprove,
  onReject,
}: {
  accounts: IAccountInfo[];
  onApprove: (account: string) => void;
  onReject: (account: string) => void;
}) => {
  function getChipStatusColor(status: number) {
    switch (status) {
      case AccountStatus.Approved:
        return "success";
      case AccountStatus.Rejected:
        return "error";
      case AccountStatus.Pending:
        return "warning";
      default:
        return "default";
    }
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Dirección</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map(({ account, role, status }) => (
            <TableRow key={account}>
              <TableCell>
                <Stack direction="column">
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    {formatAddress(account)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", opacity: 0.8 }}
                  >
                    {account}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Chip
                  label={mapRoleToLabel[role]}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={mapStatusToLabel[status]}
                  size="small"
                  color={getChipStatusColor(status)}
                />
              </TableCell>
              <TableCell>
                {status !== AccountStatus.Approved ? (
                  <UserActions
                    onApprove={() => onApprove(account)}
                    onReject={() => onReject(account)}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", opacity: 0.8 }}
                  >
                    Usuario activo
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
