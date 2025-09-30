# Pokemon Website

## Description

This Pokemon Website is a full-stack application that allows users to explore Pokemon details, manage custom stories for each Pokemon, and interact with the PokeAPI. The application provides a seamless user experience with a modern interface and robust backend functionality.

## Frameworks and Technologies

- **Frontend**: React
  - React is used to build the dynamic and interactive user interface. It manages state efficiently and provides a smooth user experience.
- **Backend**: Express.js
  - Express.js is used to handle server-side logic, including API routes for CRUD operations and database interactions.
- **Database**: SQLite
  - SQLite is used to store custom Pokemon stories locally.

## Routes

### Backend Routes

- **GET /pokemon**
  - Fetches a list of Pokemon from the PokeAPI.
- **GET /pokemon/:id**
  - Fetches details of a specific Pokemon, including its custom story if available.
- **POST /pokemon/:id/story**
  - Creates or updates a custom story for a specific Pokemon.
- **DELETE /pokemon/:id/story**
  - Deletes the custom story for a specific Pokemon and reverts to the original API story.

### Frontend Routes

- **/**
  - The homepage displaying a list of Pokemon.
- **/pokemon/:id**
  - A detailed view of a specific Pokemon, including its story and other details.

## Features

- **Pokemon Details**: View detailed information about each Pokemon, including stats, abilities, and types.
- **Custom Stories**: Add, edit, and delete custom stories for each Pokemon.
- **Integration with PokeAPI**: Fetches real-time data about Pokemon from the PokeAPI.
- **Responsive Design**: Ensures the website is accessible on various devices.

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/CodeByMoonlight/Pokemon-API-Website.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Pokemon-API-Website
   ```
3. Install dependencies for both the client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
4. Start the development servers:
   - For the client:
     ```bash
     npm run dev
     ```
   - For the server:
     ```bash
     npm start
     ```
5. Open the application in your browser at `http://localhost:5173/`.

## Acknowledgments

- **PokeAPI**: For providing the Pokemon data used in this application.
- **React**: For the powerful frontend framework.
- **Express.js**: For the robust backend framework.

## License

This project is licensed under the MIT License.

## Academic Context

This website is a project developed for the ICE 415 subject. It demonstrates the integration of modern web development frameworks and APIs to create a functional and interactive application.

## Contributors

- **Created By**:
  - Alijah Valle
  - Abby Gale Señeres
