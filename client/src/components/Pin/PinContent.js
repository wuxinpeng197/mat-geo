import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Context from "../../context";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FaceIcon from "@material-ui/icons/Face";
import Format from "date-fns/format";
import CreateComment from "../Comment/CreateComment";
import Comments from "../Comment/Comments";

const PinContent = ({ classes }) => {
  const {state, dispatch} = useContext(Context)
  const { title, content, author, comments,createAt} = state.currentPin
  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h4" color="primary" guttonBottom>
       {title}
      </Typography>
      <Typography className={classes.text} component="h3" variant="h6" color="inherit" guttonBottom>
        <FaceIcon className={classes.icon}>
        {author.name}
        </FaceIcon>
      </Typography>
      <Typography
      className={classes.text}
      variant="subtitle2"
      color="inherit"
      guttonBottom
      >
        <AccessTimeIcon className={classes.icon}/>
        {Format(Number(createAt), "MMMM Do, YYYY")}
      </Typography>
      <Typography
       variant="subtitle1"
       guttonBottom
      >
        {content}
      </Typography>

      <CreateComment/>
      <Comments comments={comments}/>
    </div>
  )
};

const styles = theme => ({
  root: {
    padding: "1em 0.5em",
    textAlign: "center",
    width: "100%"
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withStyles(styles)(PinContent);
