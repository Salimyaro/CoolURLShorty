# CoolURLShorty

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Test](#test)
- [Scaling Considerations](#scaling-considerations)

## Introduction

CoolURLShorty is a URL shortener service prototype built with Node.js, Express, TypeScript, MySQL, and Redis. The service provides RESTful APIs to shorten a URL and resolve a shortened URL back to its original form.

## Technologies

- TypeScript
- Node.js
- Express.js
- MySQL
- Redis
- Jest for testing
- Docker & Docker-compose for local development

## Installation

To run the service locally, you will need to have Node.js, Docker, and Docker-compose installed.

1. Clone the repository:
\`\`\`
git clone https://github.com/Salimyaro/CoolURLShorty.git
\`\`\`

2. Install the dependencies:
\`\`\`
npm install
\`\`\`

3. Run Docker services:
\`\`\`
npm run docker:up
\`\`\`

## Usage

Once the installation is done, run the service using:
\`\`\`
npm start
\`\`\`

This will run the service at `http://localhost:5000`.

### API Endpoints

- Shorten a URL
  \`\`\`
  POST /shorten
  \`\`\`

- Resolve a URL
  \`\`\`
  GET /resolve?short_url={shortUrl}
  \`\`\`

## Test

To run the tests, simply run:
\`\`\`
npm test
\`\`\`

## Scaling Considerations (What If)

In the case that the service needs to scale to 10,000 URL generation requests per second or 100,000 URL resolve requests per second, we would need to think about the following:

- **Load Balancing**: Distribute incoming requests across multiple instances of the application.
- **Database Sharding**: Distribute data across several databases to distribute the load and improve performance.
- **Caching**: Use Redis to cache frequently accessed URLs for faster resolution.
- **Rate Limiting**: Implement rate limiting to protect against abuse.

For URL generation, we could use a Base62 encoding to ensure unique URL strings and to minimize the string length. This will help to handle a high number of URL shortening requests effectively.

For URL resolving, since it is a read-heavy operation, we can utilize caching mechanisms to speed up the resolving process. This is essential to handle up to 100,000 URL resolve requests per second.

## License

ISC
