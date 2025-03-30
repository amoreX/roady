# Roady

Roady is a roadmap editor application that allows users to create, customize, and finalize roadmaps. The application provides an intuitive interface for editing roadmaps and includes features like modal-based customization and real-time updates.

## Features

- **Roadmap Editor**: A powerful editor for creating and modifying roadmaps.
- **Customization**: Users can customize their roadmap using a modal interface.
- **Single Roadmap**: The application supports only one roadmap at a time, which is stored in the browser's local storage.
- **Real-Time Updates**: Changes to the roadmap are reflected immediately.
- **Loading State**: Visual feedback is provided during loading operations using a spinner.

## How It Works

1. **Roadmap Storage**: The roadmap data is stored in the browser's local storage. This ensures that the roadmap persists across sessions.
2. **Customization**: Users can customize the roadmap by entering details in a modal. The customization is processed and applied to the roadmap.
3. **Finalization**: Once the roadmap is finalized, users can navigate to the tree view for further exploration.

## Key Components

- **RoadmapEditorPage**: The main page for editing the roadmap.
- **Modal**: A reusable modal component for customization.
- **Toast Notifications**: Feedback messages are displayed using the `sonner` library.
- **Loading Spinner**: A spinner icon (`react-icons/fa`) is used to indicate loading states.

## Usage

1. **Reset Roadmap**: Click the "Reset" button to clear the current roadmap and start fresh.
2. **Customize Roadmap**: Click the "Customize" button to open the modal and enter customization details.
3. **Finalize Roadmap**: Click the "Finalize Roadmap" button to save and navigate to the tree view.

## Limitations

- **Single Roadmap**: Only one roadmap can be managed at a time. Creating a new roadmap will overwrite the existing one.
- **Local Storage**: The roadmap is stored in the browser's local storage. Clearing the browser's storage will delete the roadmap.

## Development

### Prerequisites

- Node.js and npm installed.
- A modern browser for testing.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/roady.git
   ```
2. Navigate to the project directory:
   ```bash
   cd roady
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open the application in your browser at `http://localhost:3000`.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.