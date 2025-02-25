// /app/api/forums/[forumId]/threads/[threadId]/comments/route.js
import admin from '@utils/firebaseAdmin';

const db = admin.database();

export const POST = async (req, { params }) => {
  const { forumId, threadId } = params;
  const { comment, createdBy } = await req.json();

  const commentRef = db.ref(`forums/${forumId}/threads/${threadId}/comments`).push();
  await commentRef.set({
    comment,
    createdBy,
  });

  return new Response(JSON.stringify({ commentId: commentRef.key }), {
    status: 201,
  });
};
