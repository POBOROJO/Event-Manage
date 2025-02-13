# Event Management Platform

## Project Description

This is a full-stack event management platform that allows users to create, manage, and view events. The platform includes user authentication, event creation and management tools, and real-time updates for attendees.

## Features

### Frontend

-   **User Authentication:** Users can register and log in. Guest login is also available with limited features.
-   **Event Dashboard:** Displays a list of upcoming and past events with filtering options.
-   **Event Creation:** Form to create an event with fields like event name, description, date/time, and more.
-   **Real-Time Attendee List:** Shows the number of attendees for each event in real-time.
-   **Responsive Design:** The platform works seamlessly on all devices.

### Backend

-   **Authentication API:** Uses JWT for secure authentication.
-   **Event Management API:** CRUD operations for events with ownership restrictions.
-   **Real-Time Updates:** Uses WebSockets for real-time updates.
-   **Database:** Stores event and user data efficiently.

## Technologies Used

### Frontend

-   React.js
-   Shadcn
-   Framer Motion
-   TypeScript

### Backend

-   Node.js
-   Express
-   TypeScript

### Database

-   MongoDB

### Image Hosting

-   Cloudinary

### Real-time Communication

-   Socket.io

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd event-management
    ```

2.  **Install dependencies:**

    ```bash
    cd client
    npm install # or pnpm install or yarn install
    cd ../server
    npm install # or pnpm install or yarn install
    ```

3.  **Set up environment variables:**

    -   Create `.env` file in the `server` directory.
    -   Add the following environment variables:

        ```
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret
        ```

4.  **Run the application:**

    ```bash
    cd server
    npm run dev # or pnpm run dev or yarn run dev
    ```

    ```bash
    cd client
    npm run dev # or pnpm run dev or yarn run dev
    ```

## Contribution Guidelines

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch.
3.  Make your changes.
4.  Commit your changes with a descriptive message.
5.  Push to your forked repository.
6.  Create a pull request.

## License

[MIT](LICENSE)
