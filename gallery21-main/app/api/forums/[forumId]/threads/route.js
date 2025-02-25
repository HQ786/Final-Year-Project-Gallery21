// /app/api/forums/[forumId]/threads/route.js
import admin from '@utils/firebaseAdmin';

const db = admin.database();

export const POST = async (req, { params }) => {
  const { forumId } = params;
  const { title, content, createdBy } = await req.json();

  const threadRef = db.ref(`forums/${forumId}/threads`).push();
  await threadRef.set({
    title,
    content,
    createdBy,
    comments: [],
  });

  return new Response(JSON.stringify({ threadId: threadRef.key }), {
    status: 201,
  });
};
