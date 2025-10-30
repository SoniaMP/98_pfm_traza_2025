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

const CardHeaderTitle = ({
  title,
  helperText,
}: {
  title: string;
  helperText: string;
}) => {
  return (
    <Stack textAlign="justify">
      <Typography variant="body1" sx={{ flexGrow: 1 }} fontWeight={700}>
        {title}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ opacity: 0.8 }}
      >
        {helperText}
      </Typography>
    </Stack>
  );
};

export default CardHeaderTitle;
