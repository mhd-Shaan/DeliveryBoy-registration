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
import { Link } from 'react-router-dom';

// Custom theme
const theme = createTheme({
  palette: {
    primary: { main: '#1a56db' },
    secondary: { main: '#64748b' },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
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
    licenseImages: [],
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
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
      if (!formData.phone) errors.phone = 'Phone is required';
      else if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Must be 10 digits';
    } else if (step === 1) {
      if (!formData.otp) errors.otp = 'OTP is required';
      else if (!/^\d{6}$/.test(formData.otp)) errors.otp = 'Must be 6 digits';
    } else if (step === 2) {
      if (!formData.password) errors.password = 'Password is required';
      else if (formData.password.length < 6) errors.password = 'Min 6 characters';
      if (!formData.district) errors.district = 'District is required';
      if (!formData.pincode) errors.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = 'Must be 6 digits';
      if (!formData.address) errors.address = 'Address is required';
    } else if (step === 3) {
      if (!formData.dob) errors.dob = 'Date of Birth required';
      if (!formData.gender) errors.gender = 'Gender required';
      if (!formData.licenseNumber) errors.licenseNumber = 'License Number required';
      if (formData.licenseImages.length < 2) errors.licenseImages = 'Upload 2 images';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/verify-otp', {
        email: formData.email,
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

  const submitPersonalInfo = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('district', formData.district);
      data.append('pincode', formData.pincode);
      data.append('address', formData.address);
      if (formData.photo) data.append('photo', formData.photo);
      setActiveStep(3);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving info', 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitLicenseInfo = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('district', formData.district);
      data.append('pincode', formData.pincode);
      data.append('address', formData.address);
      data.append('dob', formData.dob);
      data.append('gender', formData.gender);
      data.append('licenseNumber', formData.licenseNumber);
      if (formData.photo) data.append('photo', formData.photo);
      formData.licenseImages.forEach((file) => data.append('licenseImage', file));

      const response = await axios.post('http://localhost:5000/finalregistration', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showSnackbar(response.data.message || 'Registration successful');
      setActiveStep(4);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error completing registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 0) sendOtp();
      else if (activeStep === 1) verifyOtp();
      else if (activeStep === 2) submitPersonalInfo();
      else if (activeStep === 3) submitLicenseInfo();
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (field === 'licenseImages') {
      if (files.length > 2) {
        showSnackbar('Select only 2 images', 'error');
        return;
      }
      setFormData((prev) => ({ ...prev, licenseImages: files }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth label="Full Name" name="name" value={formData.name}
              onChange={handleChange} margin="normal"
              error={!!formErrors.name} helperText={formErrors.name}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment>) }}
            />
            <TextField
              fullWidth label="Email" name="email" type="email"
              value={formData.email} onChange={handleChange}
              margin="normal" error={!!formErrors.email}
              helperText={formErrors.email}
              InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment>) }}
            />
            <TextField
              fullWidth label="Phone Number" name="phone"
              value={formData.phone} onChange={handleChange}
              margin="normal" error={!!formErrors.phone}
              helperText={formErrors.phone}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon color="primary" /></InputAdornment>) }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'secondary.main' }}>
              We’ve sent a 6-digit OTP to your phone
            </Typography>
            <TextField
              fullWidth label="Enter OTP" name="otp"
              value={formData.otp} onChange={handleChange}
              margin="normal" inputProps={{ maxLength: 6 }}
              error={!!formErrors.otp} helperText={formErrors.otp}
              InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon color="primary" /></InputAdornment>) }}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Didn’t get it? <Button variant="text">Resend</Button>
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth label="Password" name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={handleChange}
              margin="normal" error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><LockIcon color="primary" /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth label="District" name="district" value={formData.district}
              onChange={handleChange} margin="normal"
              error={!!formErrors.district} helperText={formErrors.district}
              InputProps={{ startAdornment: (<InputAdornment position="start"><LocationIcon color="primary" /></InputAdornment>) }}
            />
            <TextField
              fullWidth label="Pincode" name="pincode" value={formData.pincode}
              onChange={handleChange} margin="normal"
              error={!!formErrors.pincode} helperText={formErrors.pincode}
              InputProps={{ startAdornment: (<InputAdornment position="start"><LocationIcon color="primary" /></InputAdornment>) }}
            />
            <TextField
              fullWidth label="Address" name="address" multiline rows={3}
              value={formData.address} onChange={handleChange}
              margin="normal" error={!!formErrors.address}
              helperText={formErrors.address}
              InputProps={{ startAdornment: (<InputAdornment position="start"><HomeIcon color="primary" /></InputAdornment>) }}
            />
            <FormLabel sx={{ mt: 2, mb: 1 }}>Upload Photo</FormLabel>
            <Button variant="outlined" component="label" fullWidth startIcon={<UploadIcon />}>
              Upload Photo
              <input hidden type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
            </Button>
            {formData.photo && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Avatar src={URL.createObjectURL(formData.photo)} sx={{ width: 100, height: 100, mx: 'auto' }} />
              </Box>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth label="Date of Birth" name="dob" type="date"
              value={formData.dob} onChange={handleChange}
              margin="normal" InputLabelProps={{ shrink: true }}
              error={!!formErrors.dob} helperText={formErrors.dob}
            />
            <FormControl component="fieldset" sx={{ mt: 2 }} error={!!formErrors.gender}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup name="gender" value={formData.gender} onChange={handleChange} row>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
              {formErrors.gender && <Typography color="error" variant="caption">{formErrors.gender}</Typography>}
            </FormControl>
            <TextField
              fullWidth label="License Number" name="licenseNumber"
              value={formData.licenseNumber} onChange={handleChange}
              margin="normal" error={!!formErrors.licenseNumber}
              helperText={formErrors.licenseNumber}
              InputProps={{ startAdornment: (<InputAdornment position="start"><LicenseIcon color="primary" /></InputAdornment>) }}
            />
            <FormLabel sx={{ mt: 2, mb: 1 }}>Upload 2 License Images</FormLabel>
            <Button variant="outlined" component="label" fullWidth startIcon={<UploadIcon />}>
              Upload License Images
              <input hidden type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'licenseImages')} />
            </Button>
            {formErrors.licenseImages && <Typography color="error" variant="caption">{formErrors.licenseImages}</Typography>}
            {formData.licenseImages.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                {formData.licenseImages.map((file, i) => (
                  <Avatar key={i} variant="rounded" src={URL.createObjectURL(file)} sx={{ width: 120, height: 80 }} />
                ))}
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white', p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h4">SPARE WALA</Typography>
            <Typography variant="h6">Register as Spare Wala Partner</Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          {/* Form Steps */}
          {activeStep === steps.length ? (
            <Box textAlign="center" py={4}>
              <SuccessIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5">Registration Successful!</Typography>
              <Typography color="textSecondary">
                Thank you for registering as a Spare Wala Partner.
              </Typography>
            </Box>
          ) : (
            <>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button onClick={handleBack} disabled={activeStep === 0 || loading} startIcon={<BackIcon />} variant="outlined">
                  Back
                </Button>
                <Button onClick={handleNext} variant="contained" disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} /> : <NextIcon />}>
                  {loading ? 'Processing...' : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>

              {/* ✅ Login button below form */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  Already have an account?{' '}
               <Button
  component={Link}
  to="/login"
  variant="text"
  sx={{ fontWeight: 600, textTransform: 'none' }}
>
  Login
</Button>

                </Typography>
              </Box>
            </>
          )}
        </Paper>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default MultiStepForm;
