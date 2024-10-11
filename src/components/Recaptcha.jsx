/* eslint-disable react/prop-types */
import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaComponent = ({ onVerify }) => {
  const handleRecaptchaChange = (value) => {
    onVerify(value);
  };

  return (
    <div>
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTIA_KEY}
        onChange={handleRecaptchaChange}
      />
    </div>
  );
};

export default RecaptchaComponent;
