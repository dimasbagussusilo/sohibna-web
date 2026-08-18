// RFC-4122 v4 UUID without a dependency. Used for client-supplied ids that must
// be valid UUIDs server-side (reading-log sessions, khatm goals) so retries are
// idempotent. Randomness quality is fine — these are identifiers, not secrets.
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
