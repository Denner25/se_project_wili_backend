# WILI – Would I Like It? - Backend

This is the backend for WILI, the final project of the TripleTen Software Engineering program and my first creative project. It powers the frontend application where users can search movies and animes via the TMDB API and mark them with moods and genres for a more expressive experience.

## Features

- **User authentication:** JWT-based signup, login, and token validation.
- **Items & moods:** Each item stores mood objects with name and users array, allowing multiple users to tag the same item independently.
- **Per-user mood handling:** Only the current user’s mood selections are reflected in their profile and top moods.
- **Safe deletion:** Removing a mood from an item only removes the current user from that mood’s users array; the item is deleted from the server only if no users remain for any mood. |

- **MongoDB + Mongoose:** Schema design includesa nested mood subdocument consisting of an object with the name string and an array of all users who marked that mood for tracking multiple user selections.
- **Robust validation:** Ensures that only authenticated users can add, edit, or remove moods.

## Technical highlights

- **Express.js server** with modular routes for users, items, and moods.
- **State consistency:** The backend logic supports per-user deletion of moods and proper updating of shared items.
- **Integration-friendly:** Designed to work seamlessly with the frontend via REST endpoints; supports dynamic updates without losing other users’ data.

## Future Improvements

- Track item popularity and dynamically suggest posters or highlights.
- Add mood statistics.

## Tech Stack

- Node.js / Express.js
- MongoDB / Mongoose
- JWT Authentication
- REST API
