# Shirkus Website

## Description

Shirkus Website is a website created for my Shirkus kennel. The site uses Sanity as a CMS so the user can easily upload images, names, and other information about the dogs. This information is then retrieved and displayed on the website.

## Technologies Used

- **React (Vite)** – Frontend framework
- **Sanity** – Headless CMS for content management
- **Bootstrap / React Bootstrap** – Styling and UI components
- **Styled-components** – For custom styling
- **React Router** – Navigation handling
- **Dotenv** – Managing environment variables

## Setup

### 1. Clone the project

```bash
git clone https://github.com/ditt-repo/shirkus-website.git
cd shirkus-website
```

### 2. Install dependencies

```bash
npm install

```

### 3. Configure environment variables

Create a `.env` file in the root folder and add your Sanity project ID:

```bash
VITE_SANITY_PROJECT_ID=din_sanity_project_id
VITE_SANITY_DATASET=production

```

### 4. Run locally

```bash
npm run dev

```

The website will now be available at `http://localhost:5173/`.

## Sanity Models

The website fetches information from Sanity with the following document types:

### Dog

- Name, nickname, breed, color, gender
- Dog type (Current, Breeding, Former)
- Birthdate and possible death date
- Health information
- Images and gallery
- Pedigree

### Litter

- Information about mother and father
- Birthdate / Expected birthdate
- Details about puppies (count, color, gender)
- Images and gallery from different weeks
- Litter description

## Features

- **Fetch data from Sanity** and dynamically display it on the site
- **Filter dogs** based on type (current, breeding, former)
- **Gallery** for each litter
- **Responsive design** with Bootstrap

## Further Development

- Add better validation and error handling
- Implement loader and error messages
- Optimize image loading

## License

This project is private and not open for commercial use without permission.

---

## Contact

- [My LinkedIn page](https://www.linkedin.com/in/kristine-tyrholm-7902172a4)
- [My Portforlio](https://kristinetyrholm.netlify.app)