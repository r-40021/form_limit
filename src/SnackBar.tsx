import * as React from 'react';
import Snackbar from "@mui/material/Snackbar";

type Props = {
  open: boolean | undefined;
  setOpen: Function;
  message: string;
}

export default function SettingSnackBar({open, setOpen, message}: Props) {
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
      message={message}
    />
  );
}