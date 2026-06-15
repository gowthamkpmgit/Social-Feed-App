import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearLoginError } from "../redux/reducers/usersSlice";
import { toast } from "react-toastify";
import type { RootState } from "../redux/store";

export type LoginCredentials = {
  username: string;
  password: string;
};
const SigninPage: React.FC = () => {
  const initialValues = { username: "", password: "" };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, loginError } = useSelector(
    (state: RootState) => state.user,
  );

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const validationSchema = Yup.object({
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
  const handleSubmit = (values: LoginCredentials) => {
    dispatch(
      loginUser({
        username: values.username,
        password: values.password,
      }),
    );
  };
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Logged in successfully");
      navigate("/feed");
    } else if (loginError) {
      toast.error(loginError);
      dispatch(clearLoginError());
    }
  }, [isAuthenticated, loginError]);

  return (
    <div>
      <AuthLayout badge="Welcome Back">
        <Box></Box>
        <Box className="flex-col">
          <Box>
            <Typography variant="h5">Sign in to your account</Typography>
          </Box>
          <Box className="mt-3">
            <Typography sx={{ fontSize: "11px" }} className="text-gray-400">
              Enter your username and password
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
                        name="username"
                        label="Username"
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": { fontSize: "0.8rem" },
                          "& .MuiInputLabel-root": { fontSize: "0.8rem" },
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
                        }}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
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
                        Sign in <ArrowForwardIcon />
                      </Button>
                    </Grid>
                    <Grid size={8} className="mt-2">
                      <Button
                        fullWidth
                        variant="outlined"
                        className="rounded-[18px]"
                        sx={{
                          borderRadius: "18px",
                          textTransform: "capitalize",
                        }}
                        onClick={() => {
                          navigate("/sign-up");
                        }}
                      >
                        Create new account
                      </Button>
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

export default SigninPage;
