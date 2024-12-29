// src/forms/cellphone.ts
import { Hono } from "hono";

const app = new Hono();


export const cellphoneFormHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Phone Number Form</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 20px auto;
            padding: 0 20px;
          }
          .form-container {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
          }
          input[type="tel"] {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="form-container">
          <h1>Cell Phone Number Submission</h1>
          <p>Please enter your phone number below. We'll process it and forward it to our service.</p>
          
          <form id="phoneForm">
            <input type="tel" id="phoneNumber" name="phoneNumber" 
                   pattern="[0-9]{10}" 
                   placeholder="Enter your phone number (10 digits)"
                   required>
            <button type="submit">Submit</button>
          </form>
          <div id="status"></div>
        </div>

        <script>
          document.getElementById('phoneForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const statusDiv = document.getElementById('status');
            const phoneNumber = document.getElementById('phoneNumber').value;
            
            statusDiv.textContent = 'Processing...';
            
            try {
              const response = await fetch('/forms/submit', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
              });
              
              if (response.ok) {
                statusDiv.textContent = 'Successfully submitted!';
              } else {
                statusDiv.textContent = 'Error submitting phone number';
              }
            } catch (error) {
              statusDiv.textContent = 'Error: ' + error.message;
            }
          });
        </script>
      </body>
    </html>
  `;
