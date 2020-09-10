import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Context from "../../context";
import axios from "axios";
import { useClient} from "../../client";
import { BASE_URL } from "../../client";
import { GraphQLClient } from "graphql-request";
import { CREATE_PIN_MUTATION} from "../../graphql/mutations"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

const CreatePin = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const client = useClient();
  const [title, setTitle] = useState('')
  const [image, setImage ] = useState('')
  const [content, setContent] = useState('')
  const {state, dispatch} = useContext(Context)
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = () => {
    setImage('')
    setTitle('')
    setContent('')
    dispatch({type: "DELETE_DRAFT"})
  }

  const handleImage = async() => {
    let data = new FormData
    data.append("file", image)
    data.append("upload_preset", "lj8ivojd")
    let response = await axios.post(
      "https://api.cloudinary.com/v1_1/dvsxabeph/image/upload",
      data
    )
    return response.data.url
  }

  const handleSubmit = async(e) => {
    try{
    e.preventDefault()
    setSubmitting(true)
    const url = await handleImage()    
    const variables = {
      title,
      image:url,
      content,
      latitude: state.draft.latitude,
      longitude: state.draft.longitude
    }
    await client.request(CREATE_PIN_MUTATION, variables)
    handleDelete()
  } catch(err) {
      setSubmitting(false)
    }
    
  }

  return (
    <form className={classes.root}>
      <Typography
       className={classes.alignCenter}
       component="h2"
       variant="h4"
       color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge}/> Pin Location
      </Typography>
      <div>
        <TextField
        name="title"
        label="title"
        placeholder="Insert pin title"
        onChange={e => setTitle(e.target.value)}
        >     
       </TextField>  
       <input className={classes.input} onChange={e => setImage(e.target.files[0])} type="file" id="image" accept="image/*"/>
       <label htmlFor="image">
          <Button style={{color: image && "green" }} component="span" size="small" className={classes.button}>
            <AddToPhotosIcon />
          </Button>
        </label>     
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline
          rows={mobileSize ? "3" : "6"}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
      <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDelete}
        >
        Discard
        <ClearIcon className={classes.leftIcon}/>
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type='submit'
          disabled={!title.trim()  || !content.trim() || !image || submitting}
          onClick={handleSubmit}
        >
        Submit
        <SaveIcon className={classes.rightIcon}/>
        </Button>
      </div>
    </form>
  )
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
