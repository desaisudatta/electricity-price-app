# Electricity Price Application

## Overview

This is a Next.js application that displays electricity prices for various regions. The app includes two main pages:

- **Overview Page**: Displays a list of regions with their current electricity prices, along with search and filter functionality.
- **Detail Page**: Shows detailed electricity price data for a selected region, including custom tabs for various data types and charts.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest)
- **Component Library**: [shadcn UI](https://ui.shadcn.com/) (or any other component library of your choice)

## Features

- Search and filter functionality on the overview page.
- Detailed view of electricity price data for each region.
- Responsive design for desktop and mobile devices.
- User-friendly custom tabs for displaying different types of data.
- Simple charts to visualize electricity price trends.

## API

The application fetches electricity price data from the **Energy Charts API**. Ensure you have access to the API and replace the API endpoint in the code as necessary.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/desaisudatta/electricity-price-app.git
   cd electricity-price-app

2. Install Dependencies:
   npm install
    # or
   yarn install

3. Running the Application:
   npm run dev
    # or
   yarn dev


## Docker
To run the application using Docker, follow these steps:

1. Build the Docker image:

bash
Copy code
docker build -t electricity-price-app .
Run the Docker container:

bash
Copy code
docker run -p 3000:3000 electricity-price-app