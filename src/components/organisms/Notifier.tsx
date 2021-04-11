import { SnackbarKey, useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { snackbarSelectors } from "../../modules/selector/snackBarSelector";
import { snackbarActions } from "../../modules/slice/snackBarSlice";

export const Notifier: React.FC = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { removeSnackbar } = useBoundActions(snackbarActions);
  const notifications = useSelector(snackbarSelectors.notifications);
  const [displayed, setDisplayed] = useState<SnackbarKey[]>([]);
  console.log(displayed);

  const storeDisplayed = (key: SnackbarKey) => {
    setDisplayed([...displayed, key]);
  };

  const removeDisplayed = (id: SnackbarKey) => {
    setDisplayed((d) => [...d.filter((key) => id !== key)]);
  };

  useEffect(() => {
    notifications.forEach(({ key, message, options = {} }) => {
      // do nothing if snackbar is already displayed
      if (displayed.includes(key)) return;

      // display snackbar using notistack
      enqueueSnackbar(message, {
        key,
        ...options,
        onClose: (event, reason, myKey) => {
          if (options.onClose) {
            options.onClose(event, reason, myKey);
          }
        },
        onExited: (event, myKey) => {
          // remove this snackbar from redux store
          removeSnackbar(myKey);
          removeDisplayed(myKey);
        },
      });

      // keep track of snackbars that we've displayed
      storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar]);

  return <></>;
};
