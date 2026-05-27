import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storage } from '@/utils/storage';

export function useStoredGroup(options = {}) {
  const { redirectOnMissing = false } = options;
  const navigate = useNavigate();
  const { inviteCode } = useParams();
  const storedGroup = inviteCode ? storage.get(inviteCode) : null;

  useEffect(() => {
    if (!redirectOnMissing) return;

    if (!inviteCode || !storedGroup?.tripGroupId) {
      navigate('/', { replace: true });
    }
  }, [inviteCode, storedGroup, redirectOnMissing, navigate]);

  return {
    inviteCode,
    storedGroup,
    tripGroupId: storedGroup?.tripGroupId ?? null,
    memberId: storedGroup?.memberId ?? storedGroup?.id ?? null,
    role: storedGroup?.role ?? null,
  };
}
