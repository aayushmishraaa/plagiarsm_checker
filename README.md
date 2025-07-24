# Veritas AI

Veritas AI is an AI-powered plagiarism detection tool that analyzes text and highlights potential instances of plagiarism.

## Features

- **Plagiarism Detection:** Analyze text to detect potential plagiarism.
- **Text Input:** Simple interface for users to input or paste text.
- **Results Display:** Clear highlighting of potentially plagiarized sections.
- **Download Report:** Download a report of the plagiarism analysis results.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/aayushmishraaa/plagiarsm_checker.git
```

2. Install dependencies:

```bash
cd plagiarsm_checker
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add your API keys and other configuration:

```env
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
# Add other environment variables here
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Scripts

- `npm run dev`: Runs the development server with turbopack on port 9002.
- `npm run genkit:dev`: Starts the GenKit development server.
- `npm run genkit:watch`: Starts the GenKit development server with watch mode.
- `npm run build`: Builds the Next.js application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the code.
- `npm run typecheck`: Checks TypeScript types.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT License](https://opensource.org/licenses/MIT)
