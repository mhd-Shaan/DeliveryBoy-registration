import React, { useState } from 'react';
import {
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  DriveEta as LicenseIcon,
  CloudUpload as UploadIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  CheckCircle as SuccessIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import axios from 'axios';

// Create a theme with custom colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a56db',
    },
    secondary: {
      main: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    otp: '',
    password: '',
    district: '',
    pincode: '',
    address: '',
    photo: null,
    dob: '',
    gender: '',
    licenseNumber: '',
    licenseImages: [], // Changed to array for multiple images
  });

  const steps = ['Basic Info', 'OTP Verification', 'Personal Info', 'License Info'];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!formData.name) errors.name = 'Name is required';
      if (!formData.email) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
      if (!formData.phone) errors.phone = 'Phone is required';
      else if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Phone must be 10 digits';
    } else if (step === 1) {
      if (!formData.otp) errors.otp = 'OTP is required';
      else if (!/^\d{6}$/.test(formData.otp)) errors.otp = 'OTP must be 6 digits';
    } else if (step === 2) {
      if (!formData.password) errors.password = 'Password is required';
      else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (!formData.district) errors.district = 'District is required';
      if (!formData.pincode) errors.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = 'Pincode must be 6 digits';
      if (!formData.address) errors.address = 'Address is required';
    } else if (step === 3) {
      if (!formData.dob) errors.dob = 'Date of Birth is required';
      if (!formData.gender) errors.gender = 'Gender is required';
      if (!formData.licenseNumber) errors.licenseNumber = 'License Number is required';
      if (formData.licenseImages.length < 2) errors.licenseImages = 'Please upload 2 license images';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // API call for step 1: Send OTP
  const sendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/registration', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      showSnackbar(response.data.message || 'OTP sent successfully');
      setActiveStep(1);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error sending OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  // API call for step 2: Verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/verify-otp', {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        otp: formData.otp,
      });
      showSnackbar(response.data.message || 'OTP verified successfully');
      setActiveStep(2);
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'OTP verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // API call for step 3: Personal Info
  const submitPersonalInfo = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("district", formData.district);
      data.append("pincode", formData.pincode);
      data.append("address", formData.address);
      if (formData.photo) data.append("photo", formData.photo);

     
      setActiveStep(3);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving personal information', 'error');
    } finally {
      setLoading(false);
    }
  };

// API call for step 4: License Info
const submitLicenseInfo = async () => {
  try {
    setLoading(true);
    const data = new FormData();
    data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("district", formData.district);
      data.append("pincode", formData.pincode);
      data.append("address", formData.address);
    data.append("dob", formData.dob);
    data.append("gender", formData.gender);
    data.append("licenseNumber", formData.licenseNumber);
      if (formData.photo) data.append("photo", formData.photo);

    // FIX: send both files under the same field name "licenseImage"
    formData.licenseImages.forEach((file) => {
      data.append("licenseImage", file);
    });

    const response = await axios.post('http://localhost:5000/finalregistration', data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    showSnackbar(response.data.message || 'Registration completed successfully');
    setActiveStep(4);
  } catch (error) {
    showSnackbar(error.response?.data?.message || 'Error completing registration', 'error');
  } finally {
    setLoading(false);
  }
};

  const handleNext = () => {
    if (validateStep(activeStep)) {
      switch (activeStep) {
        case 0:
          sendOtp();
          break;
        case 1:
          verifyOtp();
          break;
        case 2:
          submitPersonalInfo();
          break;
        case 3:
          submitLicenseInfo();
          break;
        default:
          break;
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    
    if (field === 'licenseImages') {
      // For license images, we want exactly 2 images
      if (files.length > 2) {
        showSnackbar('Please select only 2 images', 'error');
        return;
      }
      
      setFormData((prevData) => ({
        ...prevData,
        [field]: files,
      }));
    } else {
      // For single file uploads like photo
      setFormData((prevData) => ({
        ...prevData,
        [field]: files[0],
      }));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.email}
              helperText={formErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'secondary.main' }}>
              We've sent a 6-digit verification code to your phone
            </Typography>
            <TextField
              fullWidth
              label="Enter Verification Code"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              margin="normal"
              inputProps={{ maxLength: 6 }}
              error={!!formErrors.otp}
              helperText={formErrors.otp}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'secondary.main' }}>
              Didn't receive the code? <Button variant="text" sx={{ color: 'primary.main' }}>Resend</Button>
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.district}
              helperText={formErrors.district}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.pincode}
              helperText={formErrors.pincode}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Full Address"
              name="address"
              multiline
              rows={3}
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.address}
              helperText={formErrors.address}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <FormLabel component="legend" sx={{ mt: 2, mb: 1 }}>Upload Your Photo</FormLabel>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{ py: 1.5 }}
            >
              Upload Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
              />
            </Button>
            {formData.photo && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Avatar
                  src={URL.createObjectURL(formData.photo)}
                  sx={{ width: 100, height: 100, mx: 'auto' }}
                />
              </Box>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={!!formErrors.dob}
              helperText={formErrors.dob}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CakeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }} error={!!formErrors.gender}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                sx={{ flexDirection: 'row' }}
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
              {formErrors.gender && <Typography variant="caption" color="error">{formErrors.gender}</Typography>}
            </FormControl>
            <TextField
              fullWidth
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.licenseNumber}
              helperText={formErrors.licenseNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LicenseIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <FormLabel component="legend" sx={{ mt: 2, mb: 1 }}>Upload 2 License Images</FormLabel>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{ py: 1.5 }}
            >
              Upload License Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, 'licenseImages')}
              />
            </Button>
            {formErrors.licenseImages && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {formErrors.licenseImages}
              </Typography>
            )}
            {formData.licenseImages.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Selected {formData.licenseImages.length} of 2 images
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {formData.licenseImages.map((file, index) => (
                    <Avatar
                      key={index}
                      variant="rounded"
                      src={URL.createObjectURL(file)}
                      sx={{ width: 120, height: 80 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" sx={{ mb: 4, mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white', p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                SPARE WALA
              </Box>
            </Typography>
            <Typography variant="h5" component="h2">
              Register as Spare wala Partner
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Form Content */}
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SuccessIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Registration Successful!
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Thank you for registering as a Spare Wala Partner. Your application is under review and we will contact you shortly.
              </Typography>
            </Box>
          ) : (
            <>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0 || loading}
                  startIcon={<BackIcon />}
                  variant="outlined"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} /> : <NextIcon />}
                >
                  {loading ? 'Processing...' : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </>
          )}
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default MultiStepForm;