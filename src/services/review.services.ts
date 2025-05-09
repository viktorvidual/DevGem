import { database } from "../config/firebase.js";

import {
  get,
  ref,
  query,
  orderByChild,
  equalTo,
  push,
  update,
  remove,
  DataSnapshot,
} from "firebase/database";

export interface Review {
  author: string;
  content: string;
  createdOn: number;
  addonId: string;
  userUid: string;
  userEmail: string;
  rating: number;
  reviewId: string;
  hasReply? : {[key: string]: boolean}
}

export interface ReviewReply {
  content: string; 
  author: string;
  createdOn: number;
  reviewId: string;
  addonId: string;
  replyId: string; 
}

/**
 * Transforms the reviews document snapshot into an array of review objects.
 *
 * @param {DataSnapshot} snapshot - The snapshot of the reviews document.
 * @returns {Array} - An array of review objects.
 */
export const fromReviewsDocument = (snapshot: DataSnapshot): Review[] => {
  const reviewsDocument = snapshot.val();

  return Object.keys(reviewsDocument).map((key) => {
    const review = reviewsDocument[key];

    return {
      ...review,
      id: key,
      createdOn: new Date(review.createdOn),
    };
  });
};

/**
 * Transforms the replies document snapshot into an array of reply objects.
 *
 * @param {DataSnapshot} snapshot - The snapshot of the replies document.
 * @returns {Array} - An array of reply objects.
 */
export const fromRepliesDocument = (snapshot: DataSnapshot): ReviewReply[] => {
  const repliesDocument = snapshot.val();

  return Object.keys(repliesDocument).map((key) => {
    const reply = repliesDocument[key];

    return {
      ...reply,
      replyId: key,
      createdOn: new Date(reply.createdOn),
    };
  });
};

/**
 * Fetches reviews associated with a specific post.
 *
 * @param {string} postId - The ID of the post for which to fetch comments.
 * @returns {Promise<Array>} - A promise that resolves with an array of comments for the post.
 */
export const getReviewsByAddonHandle = async (addonId: string) => {
  return get(
    query(ref(database, "reviews"), orderByChild("addonId"), equalTo(addonId))
  ).then((snapshot) => {
    if (!snapshot.exists()) return [];

    return fromReviewsDocument(snapshot);
  });
};

export const getReviewsByUserUidHandle = async (userUid: string) => {
  return get(
    query(ref(database, "reviews"), orderByChild("userUid"), equalTo(userUid))
  ).then((snapshot) => {
    if (!snapshot.exists()) return [];
    return fromReviewsDocument(snapshot);
  });
};

/**
 * Returns rating value.
 *
 * @param {string} addonId - The ID of the addon associated with the review.
 * @returns {number} the average rating of the addon
 */
export const getRatingsForAddon = async (addonId: string) => {
  const querySnapshot = await getReviewsByAddonHandle(addonId);

  let totalRating = 0;
  let ratingsCount = 0;

  try {
    querySnapshot.forEach((snapshot: Review) => {
      totalRating += snapshot.rating;
      ratingsCount++;
    });
  } catch (error) {
    console.log(error);
  }

  if (ratingsCount === 0) {
    return 0;
  }

  const averageRating = totalRating / ratingsCount;
  return averageRating;
};

export const addReview = async (
  content: string,
  author: string,
  addonId: string,
  userUid: string,
  userEmail: string,
  rating: number
) => {
  try {
    const reviewRef = ref(database, "reviews");

    const reviewData = {
      author,
      content,
      createdOn: Date.now(),
      addonId,
      userUid,
      userEmail,
      rating,
    };

    const result = await push(reviewRef, reviewData);
    const averageAddonRating = await getRatingsForAddon(addonId);
    const updateCommentIDequalToHandle: {[key: string]: string | null | boolean} = {};

    updateCommentIDequalToHandle[`/reviews/${result.key}/reviewId`] =
      result.key;
    updateCommentIDequalToHandle[`/addons/${addonId}/hasReview/${result.key}`] =
      true;
    updateCommentIDequalToHandle[`/addons/${addonId}/rating/`] =
      averageAddonRating.toFixed(2);

    await update(ref(database), updateCommentIDequalToHandle);
  } catch (error) {
    console.error("Error adding review:", error);
  }
};

/**
 * Deletes a review.
 *
 * @param {string} reviewId - The ID of the review to delete.
 * @param {string} addonId - The ID of the addon associated with the review.
 * @returns {Promise<void>}
 */
export const deleteReview = async (
  reviewId: string,
  addonId: string
): Promise<void> => {
  const shouldDelete = window.confirm(
    "Are you sure you want to delete this review?"
  );

  if (shouldDelete) {
    try {
      const reviewRef = ref(database, `reviews/${reviewId}`);

      await deleteRepliesForReview(reviewId);

      await remove(reviewRef);

      const hasReviewRef = ref(
        database,
        `addons/${addonId}/hasReview/${reviewId}`
      );
      await remove(hasReviewRef);
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      const averageAddonRating = await getRatingsForAddon(addonId);
      const updateCommentIDequalToHandle: {[key: string]: number} = {};
      updateCommentIDequalToHandle[`/addons/${addonId}/rating/`] =
        +averageAddonRating.toFixed(2);
      await update(ref(database), updateCommentIDequalToHandle);

      alert("Your review has been deleted.");
    }
  }
};

/**
 * Edits a review.
 *
 * @param {string} reviewId - The ID of the review to edit.
 * @param {string} newContent - The new content of the review.
 * @param {number} newRating - The new rating for the review.
 * @returns {Promise<void>}
 */
export const editReview = async (
  reviewId: string,
  newContent: string,
  newRating: number
): Promise<void> => {
  const reviewRef = ref(database, `reviews/${reviewId}`);

  try {
    await update(reviewRef, {
      content: newContent,
      rating: newRating,
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log("review updated");
  }
};

/**
 * Deletes all reviews for a given addon.
 *
 * @param {string} addonId - The ID of the addon for which to delete reviews.
 * @returns {Promise<void>}
 */
export const deleteReviewsForAddon = async (addonId: string): Promise<void> => {
  try {
    const reviews = await getReviewsByAddonHandle(addonId);

    if (reviews.length === 0) {
      console.log(`No reviews found for addonId ${addonId}`);
      return;
    }

    const deletionPromises = reviews.map(async (review: Review) => {
      const reviewRef = ref(database, `reviews/${review.reviewId}`);
      const hasReviewRef = ref(
        database,
        `addons/${addonId}/hasReview/${review.reviewId}`
      );

      await deleteRepliesForReview(review.reviewId);
      await remove(reviewRef);
      await remove(hasReviewRef);
    });

    await Promise.all(deletionPromises);

    console.log(`All reviews for addonId ${addonId} deleted successfully`);
  } catch (error) {
    console.error(error);
  }
};

export const addReviewReply = async (
  content: string,
  author: string,
  reviewId: string,
  addonId: string
) => {
  return push(ref(database, "replies"), {
    content,
    author,
    createdOn: Date.now(),
    reviewId,
    addonId,
  }).then((result) => {

    const updateReplyIDequalToHandle: { [key: string]: string | boolean | null } = {};

    updateReplyIDequalToHandle[`/replies/${result.key}/replyId`] = result.key;
    updateReplyIDequalToHandle[`/reviews/${reviewId}/hasReply/${result.key}`] =
      true;

    update(ref(database), updateReplyIDequalToHandle);

    console.log("Reply Uploaded");
  });
};

export const getRepliesByReviewUidHandle = async (reviewId: string) => {
  return get(
    query(ref(database, "replies"), orderByChild("reviewId"), equalTo(reviewId))
  ).then((snapshot) => {
    if (!snapshot.exists()) return [];
    return fromRepliesDocument(snapshot);
  });
};

/**
 * Deletes a review reply.
 *
 * @param {string} replyId - The ID of the reply to delete.
 * @param {string} reviewId - The ID of the review associated with the reply.
 * @returns {Promise<void>}
 */
export const deleteReviewReply = async (replyId: string, reviewId: string) => {
  try {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this review reply?"
    );

    if (shouldDelete){
      await remove(ref(database, `replies/${replyId}`));
      await remove(ref(database, `reviews/${reviewId}/hasReply/${replyId}`));

      alert("Your reply has been deleted");
    }
  } catch (error) {
    console.error("Error deleting review reply:", error);
  }
};

/**
 * Deletes all replies related to a specific review.
 *
 * @param {string} reviewId - The ID of the review for which to delete replies.
 * @returns {Promise<void>}
 */
export async function deleteRepliesForReview(reviewId: string): Promise<void> {
  try {
    const repliesSnapshot = await getRepliesByReviewUidHandle(reviewId);

    if (repliesSnapshot.length > 0) {
      const deletionPromises: Promise<void>[] = [];

      repliesSnapshot.forEach((replySnapshot) => {
        const replyRef = ref(database, `replies/${replySnapshot.replyId}`);

        const deletePromise = remove(replyRef);
        deletionPromises.push(deletePromise);
      });
      await Promise.all(deletionPromises);
      console.log("Replies Snapshot:", repliesSnapshot);
      console.log(`All replies for reviewId ${reviewId} deleted successfully`);
    } else {
      console.log("No replies to be deleted");
    }
  } catch (error) {
    console.error(error);
  }
}
