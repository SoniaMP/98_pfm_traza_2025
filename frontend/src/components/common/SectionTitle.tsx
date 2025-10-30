/*
 * .
 *        . * .
 *      * RRRR  *   Copyright (c) 2012 - 2025
 *     .  RR  R  .  EUIPO - European Union Intellectual Property Office
 *     *  RRR    *
 *      . RR RR .   ALL RIGHTS RESERVED
 *       *. _ .*
 * .
 *  The use and distribution of this software is under the restrictions exposed in 'license.txt'
 */

import { Stack, Typography } from "@mui/material";

const SectionTitle = ({
  title,
  infoText,
}: {
  title: string;
  infoText: string;
}) => {
  return (
    <Stack spacing={1}>
      <Typography variant="h5">{title}</Typography>

      <Typography variant="body1">{infoText}</Typography>
    </Stack>
  );
};

export default SectionTitle;
