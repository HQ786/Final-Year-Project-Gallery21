# Final Year Project - Gallery21

Welcome to **Gallery21**, a web-based art gallery that allows users to explore, purchase, and tokenize artwork using NFTs on the Ethereum blockchain. The platform integrates VR technology to enhance user experience through immersive virtual gallery tours. 

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)
- [Project Screenshots](#project-screenshots)

---

## Project Overview
Gallery21 is a modern online art marketplace where artists can list their artwork for sale, collectors can purchase them using Stripe, and users can tokenize their digital art as NFTs on the Ethereum blockchain. Additionally, the project includes a **Virtual Reality (VR) gallery** where users can experience artwork in a fully immersive 3D space.

## Features
- 🔹 **Art Marketplace**: Users can buy and sell artwork using Stripe for secure transactions.
- 🔹 **NFT Tokenization**: Convert digital artwork into NFTs using Ethereum smart contracts.
- 🔹 **Secure Payments**: Integrated with **Stripe API** for seamless payment processing.
- 🔹 **User Authentication**: Secure login and account management.
- 🔹 **Virtual Reality (VR) Gallery**: Experience art in a 3D environment powered by **Unity 3D**.
- 🔹 **Blockchain Integration**: Manage NFT transactions with **Web3.js** and **MetaMask**.

---

## Technology Stack
Below is the list of technologies and tools used in this project:

| Tool/Technology | Version | Rationale |
|----------------|---------|-----------|
| **MS Visual Studio** | 17.8 | Preferred IDE |
| **Git** | 2.43 | Version control |
| **Next.js** | Latest | Web frontend |
| **Stripe API** | Latest | Secure payment processing |
| **Node.js & Express** | 18.12 | Backend services |
| **MongoDB** | 6 | Scalable NoSQL database |
| **Unity 3D** | 2022.2.9 | Provides VR-based virtual gallery tours and interactive experiences |
| **Ethereum Smart Contracts & Solidity** | Latest | For NFT management system |
| **Web3.js** | Latest | Bridges the web app with Ethereum blockchain |
| **MetaMask** | Latest | Crypto wallet for NFTs |

---

## Installation
To run Gallery21 on your local machine, follow these steps:

### Prerequisites
- Install **Node.js** (v18.12)
- Install **MongoDB** (v6)
- Install **Git** (v2.43)

### Clone Repository
```sh
$ git clone https://github.com/HQ786/Final-Year-Project-Gallery21.git
$ cd Final-Year-Project-Gallery21
```

### Install Dependencies
```sh
$ npm install
```

### Setup Environment Variables
Create a `.env.local` file and add the required API keys and database connection strings.

### Run the Development Server
```sh
$ npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage
1. **Sign Up/Login** - Register as a user and log in.
2. **Browse Artworks** - View listed artworks in the marketplace.
3. **Purchase Art** - Use Stripe to buy artwork securely.
4. **Tokenize Art** - Convert artwork to NFTs and interact with Ethereum blockchain.
5. **VR Mode** - Experience immersive gallery tours using Unity 3D.

---

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/artworks` | GET | Retrieve all artworks |
| `/api/artworks/:id` | GET | Get artwork details |
| `/api/nft/mint` | POST | Mint an NFT |
| `/api/user/profile` | GET | Get user profile |
| `/api/payment/checkout` | POST | Process payment via Stripe |

---

## License
This project is licensed under the **MIT License**.

---

## Project Screenshots
Below are some screenshots of Gallery21 in action:


![Picture 1](images/Picture%201.png)


![Picture 2](images/Picture%202.png)


![Picture 3](images/Picture%203.png)


![Picture 4](images/Picture%204.png)


![Picture 5](images/Picture%205.png)


![Picture 6](images/Picture%206.png)


![Picture 7](images/Picture%207.png)


![Picture 8](images/Picture%208.png)


![Picture 9](images/Picture%209.png)


![Picture 10](images/Picture%2010.png)


![Picture 11](images/Picture%2011.png)


![Picture 12](images/Picture%2012.png)


![Picture 13](images/Picture%2013.png)


![Picture 14](images/Picture%2014.png)


![Picture 15](images/Picture%2015.png)


![Picture 16](images/Picture%2016.png)


![Picture 17](images/Picture%2017.png)


![Picture 18](images/Picture%2018.jpg)


![Picture 19](images/Picture%2019.jpg)





