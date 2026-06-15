import AuthLayout from "../layout/Layout";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/reducers/usersSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";
import { useState } from "react";

interface SignupFormValues {
  name: string;
  username: string;
  password: string;
}

const SignupPage: React.FC = () => {
  const initialValues: SignupFormValues = {
    name: "",
    username: "",
    password: "",
  };
  const users = useSelector((state: RootState) => state.user.users);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .max(10, "Maximum length required is 10")
      .matches(/^[a-zA-Z0-9]+$/, "Name must be alphanumeric"),
    username: Yup.string()
      .required("Required")
      .max(10, "Maximum length required is 10")
      .matches(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
    password: Yup.string()
      .required("Required")
      .max(10, "Maximum length required is 10")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain atleast one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  });

  const handleSubmit = (values: SignupFormValues) => {
    const isUserAlreadyPresent = users.find(
      (item) => item.username === values.username,
    );

    if (isUserAlreadyPresent) {
      toast.error("Username is already present");
      return;
    }

    dispatch(
      registerUser({
        name: values.name,
        username: values.username,
        password: values.password,
      }),
    );

    toast.success("Account created successfully");
    setTimeout(() => {
      navigate("/sign-in");
    }, 1000);
  };
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <AuthLayout badge="Get Started">
        <Box></Box>
        <Box className="flex-col">
          <Box>
            <Typography variant="h5">Create your account</Typography>
          </Box>
          <Box className="mt-3">
            <Typography sx={{ fontSize: "11px" }} className="text-gray-400">
              Just three quick fields and you're in.
            </Typography>
          </Box>
          <Box className="mt-4">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ touched, errors, values }) => (
                <Form noValidate>
                  <Grid container spacing={2}>
                    <Grid size={8}>
                      <Field
                        as={TextField}
                        name="name"
                        label="Name"
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": { fontSize: "0.8rem" },
                          "& .MuiInputLabel-root": { fontSize: "0.8rem" },
                          "& .MuiFormHelperText-root": {
                            minHeight: "20px",
                            margin: "3px 0 0 0",
                          },
                        }}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid size={8}>
                      <Field
                        as={TextField}
                        name="username"
                        label="Username"
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": { fontSize: "0.8rem" },
                          "& .MuiInputLabel-root": { fontSize: "0.8rem" },
                          "& .MuiFormHelperText-root": {
                            minHeight: "20px",
                            margin: "3px 0 0 0",
                          },
                        }}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                      />
                    </Grid>
                    <Grid size={8} className="mt-2">
                      <Field
                        as={TextField}
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": { fontSize: "0.8rem" },
                          "& .MuiInputLabel-root": { fontSize: "0.8rem" },
                          "& .MuiFormHelperText-root": {
                            minHeight: "20px",
                            margin: "3px 0 0 0",
                          },
                        }}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onClick={handleClickShowPassword}
                                  disabled={!values?.password}
                                >
                                  {showPassword ? (
                                    <Box className="text-xs">Hide</Box>
                                  ) : (
                                    <Box className="text-xs">Show</Box>
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                      />
                    </Grid>
                    <Grid size={8} className="mt-2">
                      <Button
                        type="submit"
                        fullWidth
                        className="bg-gradient-to-br from-indigo-800 to-purple-500"
                        variant="contained"
                        sx={{
                          borderRadius: "18px",
                          textTransform: "capitalize",
                        }}
                      >
                        Create account <ArrowForwardIcon />
                      </Button>
                    </Grid>
                    <Grid size={8} className="mt-2">
                      <Box className="flex items-center">
                        <Typography variant="subtitle2">
                          Already have an account?&nbsp;
                        </Typography>
                        <Link to="/sign-in">
                          <Typography
                            variant="subtitle2"
                            className="text-blue-800"
                          >
                            Sign in
                          </Typography>
                        </Link>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </AuthLayout>
    </div>
  );
};

export default SignupPage;
