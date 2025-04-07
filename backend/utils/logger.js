// Logger utility to control logging throughout the application
const logger = {
    // Set enableLogs to false to suppress non-essential logs
    enableLogs: false,
    
    // For general information
    info: function(message) {
      if (this.enableLogs) {
        console.log(`[INFO] ${message}`);
      }
    },
    
    // For server operations
    server: function(message) {
      // Always log server operations for visibility
      console.log(`[SERVER] ${message}`);
    },
    
    // For errors - always log these
    error: function(message, error) {
      console.error(`[ERROR] ${message}`, error ? error : '');
    },
    
    // For API routes and requests (non-sensitive)
    api: function(method, route) {
      if (this.enableLogs) {
        console.log(`[API] ${method} ${route}`);
      }
    },
    
    // Never log sensitive information
    sensitive: function() {
      // This function intentionally does nothing
      // We never want to log sensitive information
      return;
    }
  };
  
  module.exports = logger; 