import React, { useContext, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Context from "../context";
import { Paper } from "@material-ui/core";
import PinContent from "./Pin/PinContent";
import NoContent from "../components/Pin/NoContent";
import CreatePin from "../components/Pin/CreatePin";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

const Blog = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const { state } = useContext(Context)
  const { draft, currentPin } = state

  let BlogContent;
  if(!draft && !currentPin){
    BlogContent = NoContent;
  }else if (!draft && currentPin) {
    BlogContent = PinContent
  }else if(draft){
    BlogContent = CreatePin;
  }


  return (
    <Paper className={mobileSize ? classes.rootMobile : classes.root}>
      <BlogContent/>
    </Paper>
  )
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center"
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
};

export default withStyles(styles)(Blog);
