import React, { useState } from "react";
import axios from "axios";
import '/src/assets/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Contact Form Submission",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });
    
    try {
      const response = await axios.post("http://localhost:3000/api/contact", formData);
      setStatus({ type: "success", message: "Message sent successfully! We'll get back to you soon." });
      setFormData({ name: "", email: "", subject: "Contact Form Submission", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({ 
        type: "error", 
        message: error.response?.data?.error || "Failed to send message. Please try again later." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper"> {/* Wrapper for centering */}
      <div className="contact-container">
        <h1 className="contact-title">Contact Us</h1>
        {status.message && (
          <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
            {status.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="contact-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="contact-input"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="contact-textarea"
          ></textarea>
          <button 
            type="submit" 
            className="contact-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
