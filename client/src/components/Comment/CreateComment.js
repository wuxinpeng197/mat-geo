import React, { useContext, useState } from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import { CREATE_COMMENT_MUTATION } from "../../graphql/mutations"
import { useClient } from '../../client';
import Context from "../../context";

const CreateComment = ({ classes }) => {
  const client = useClient()
  const [ comment, setComment ] = useState("")
  let {state, dispatch} = useContext(Context)

  const handleSubmit = async() => {
    const varieables =  {pinId: state.currentPin._id, text: comment}
    await client.request(CREATE_COMMENT_MUTATION, varieables)
    setComment("")
  }
  return (
    <>
      <form className={classes.form}>
        <IconButton onClick={e => setComment('')} className={classes.clearButton} disabled={!comment.trim()}>
          <ClearIcon/>
        </IconButton>
        <InputBase className={classes.Input} placeholder="Add comment"
        multiline={true} 
        value={comment}
        onChange={e => setComment(e.target.value)}
        />
        <IconButton
        disabled={!comment.trim()}
        onClick={handleSubmit} 
        className={classes.sendButton}>
          <SendIcon/>
        </IconButton>
      </form>   
      <Divider/>
    </>
  )
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
