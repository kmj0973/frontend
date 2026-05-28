import { storage } from '@/utils/storage';

function isSameVoteOwner(vote, tripGroupId, memberId) {
  if (!vote) return false;

  return (
    String(vote.tripGroupId ?? '') === String(tripGroupId ?? '') &&
    String(vote.memberId ?? '') === String(memberId ?? '')
  );
}

export function getStoredVote(inviteCode, tripGroupId, memberId) {
  if (!inviteCode) return null;

  const group = storage.get(inviteCode);
  const vote = group?.vote ?? null;

  return isSameVoteOwner(vote, tripGroupId, memberId) ? vote : null;
}

export function saveStoredVote(inviteCode, tripGroupId, memberId, planId) {
  if (!inviteCode) return;

  const group = storage.get(inviteCode);
  if (!group) return;

  storage.set(inviteCode, {
    ...group,
    vote: {
      planId,
      tripGroupId,
      memberId,
      votedAt: new Date().toISOString(),
    },
  });
}

export function clearStoredVote(inviteCode) {
  if (!inviteCode) return;

  const group = storage.get(inviteCode);
  if (!group?.vote) return;

  const { vote, ...rest } = group;
  storage.set(inviteCode, rest);
}
