import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

const google = window.google;

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

export default function PlaceSearch(props) {
  const service = new google.maps.places.AutocompleteService();
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const handleChange = (e, val) => {
    setInputValue(val);
    // get the id
    for (let i = 0; i < options.length; i++) {
      if (options[i].description === val) props.onChange(options[i]);
    }
    service.getPlacePredictions({
      input: val
    }, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setOptions(predictions)
      }
    });
  };

  return (
    <Autocomplete
      getOptionLabel={option => (typeof option === 'string' ? option : option.description)}
      filterOptions={x => x}
      options={options}
      autoComplete
      includeInputInList
      onInputChange={handleChange}
      renderInput={params => (
        <TextField
          {...params}
          label="Add a location"
          variant="outlined"
          fullWidth
        />
      )}
      renderOption={option => {
        // console.log(option);
        // const parts = parse(
        //   option.structured_formatting.main_text,
        //   matches.map(match => [match.offset, match.offset + match.length]),
        // );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon}/>
            </Grid>
            <Grid item xs>
                <span>
                  {option.structured_formatting.main_text}
                </span>

              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
