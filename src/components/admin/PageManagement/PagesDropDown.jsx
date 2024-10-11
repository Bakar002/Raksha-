/* eslint-disable react/prop-types */
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { useField, useFormikContext } from "formik";

const StyledFormControl = styled(FormControl)(({ theme, error }) => ({
  minWidth: 120,
  margin: theme.spacing(1),
  ...(error && {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "red",
      },
      "&:hover fieldset": {
        borderColor: "red",
      },
      "&.Mui-focused fieldset": {
        borderColor: "red",
      },
    },
  }),
}));

const PagesDropDown = ({ name }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event) => {
    setFieldValue(name, event.target.value);
  };

  const pagesCategories = [
    "About Us",
    "Membership and Volunteering",
    "Advocacy and Awareness",
    "Media and Achievements",
    "Donations and Fundraising",
    "Contact and Policies",
    "Project Reports",
    "Resources and Downloads",
    "Special Initiatives",
  ];

  const isError = meta.touched && Boolean(meta.error);

  return (
    <StyledFormControl error={isError} required fullWidth>
      <InputLabel id="pages-category-label">Page category</InputLabel>
      <Select
        labelId="pages-category-label"
        id="pages-category-select"
        {...field}
        value={field.value || ""}
        label="Page category *"
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
              width: "auto",
            },
          },
        }}
      >
        {pagesCategories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
      {isError && <FormHelperText>{meta.error}</FormHelperText>}
    </StyledFormControl>
  );
};

export default PagesDropDown;
