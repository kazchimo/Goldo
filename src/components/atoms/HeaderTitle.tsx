import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";
import logo from "../../assets/logo.png";

export const HeaderTitle: React.FC = ({}) => {
  return (
    <Grid container alignItems={"flex-end"}>
      <Grid item>
        <img src={logo} alt={"logo"} style={{ width: 30 }} />
      </Grid>
      <Grid item>
        <Typography variant="h6" noWrap>
          oldo
        </Typography>
      </Grid>
    </Grid>
  );
};
