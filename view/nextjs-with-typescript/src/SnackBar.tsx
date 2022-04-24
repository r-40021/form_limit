import * as React from 'react';
import Snackbar from "@mui/material/Snackbar";

type Props = {
  open: boolean | undefined;
  setOpen: Function;
}

export default function SettingSnackBar({open, setOpen}: Props) {
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      message="設定しています…"
    />
  );
}