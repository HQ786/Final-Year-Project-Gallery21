// /app/api/forums/route.js
import admin from '@utils/firebaseAdmin';

const db = admin.database();

// POST method to create a forum
export const POST = async (req) => {
  try {
    // Parse the request body
    const { name, description, createdBy } = await req.json();

    // Reference to the 'forums' collection in Firebase Realtime Database
    const forumRef = db.ref('forums').push(); // This creates a new entry with a unique ID

    // Set the data for the new forum
    await forumRef.set({
      name,
      description,
      createdBy,
      threads: [], // No threads initially
      createdAt: new Date().toISOString(), // Add creation timestamp
    });

    // Return a response with the new forum ID
    return new Response(
      JSON.stringify({ forumId: forumRef.key, message: 'Forum created successfully' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating forum:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to create forum', error: error.message }),
      { status: 500 }
    );
  }
};
