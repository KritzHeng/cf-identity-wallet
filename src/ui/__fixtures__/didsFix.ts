import {
  DIDDetails,
  IdentityType,
} from "../../core/aries/ariesAgent.types";

// @TODO - foconnor: When UI in place for KERI, need KERIDetails here too.
const didsFix: DIDDetails[] = [
  {
    id: "did:key:z6MkpNyGdYK5Ey1pCf5cy1S9gbLD1857nQoZxVeeGifA1ZQv",
    method: IdentityType.KEY,
    displayName: "Anonymous ID",
    createdAtUTC: "2023-01-01T19:23:24Z",
    colors: ["#92FFC0", "#47FF94"],
    keyType: "Ed25519",
    controller: "did:key:z6MkpNyGdCf5cy1S9gbLD1857YK5Ey1pnQoZxVeeGifA1ZQv",
    publicKeyBase58: "AviE3J4duRXM6AEvHSUJqVnDBYoGNXZDGUjiSSh96LdY",
  },
  {
    id: "did:key:z6MkpNyGdYK5Ey1pCf5cyQoZxVeeGifA1ZQv1S9gbLD1857n",
    method: IdentityType.KEY,
    displayName: "Public ID",
    createdAtUTC: "2023-01-01T19:23:24Z",
    colors: ["#FFBC60", "#FFA21F"],
    keyType: "Ed25519",
    controller: "did:key:z6MkpNyGdYK5Ey1pCf5cyQoZxVeeGifA1ZQv1S9gbLD1857n",
    publicKeyBase58: "AviE3J4dnDBYoGNXZDGUjiSSh96uRXM6AEvHSUJqVLdY",
  },
  {
    id: "did:key:z6MkpNycy1S9gpCf5857nQoZxVbLD1GdYK5Ey1eeGifA1ZQv",
    method: IdentityType.KEY,
    displayName: "Offline ID",
    createdAtUTC: "2023-01-01T19:23:24Z",
    colors: ["#D9EDDF", "#ACD8B9"],
    keyType: "Ed25519",
    controller: "did:key:z6MkpNycy1S9gpCf5857nQoZxVbLD1GdYK5Ey1eeGifA1ZQv",
    publicKeyBase58: "AviE3J4duRYoGNXZDGUjiSShXM6AEvHSUJqVnDB96LdY",
  },
  {
    id: "did:key:z6MkpNyGd9gbLD1857nQoZYK5Ey1pCf5cy1SxVeeGifA1ZQv",
    method: IdentityType.KERI,
    displayName: "Professional ID",
    createdAtUTC: "2023-01-01T19:23:24Z",
    colors: ["#47E0FF", "#00C6EF"],
    keyType: "Ed25519",
    controller: "did:key:z6MkpNyGdYK5Ey1pCS9gbLD1857nQoZf5cy1xVeeGifA1ZQv",
    publicKeyBase58: "AviE3J4duRXM6AEvHSUJqVnDBYoGNXZDGUjiSSh96LdY",
  },
  {
    id: "did:key:z6MkpNycy1S9gpCf5857nQoZxVbLD1GdYK5Ey1eeGifA1ZQvb",
    method: IdentityType.KERI,
    displayName: "Offline ID",
    createdAtUTC: "2023-01-01T19:23:24Z",
    colors: ["#FF9780", "#FF5833"],
    keyType: "Ed25519",
    controller: "did:key:z6MkpNycy1S9gpCf5857nQoZxVbLD1GdYK5Ey1eeGifA1ZQj",
    publicKeyBase58: "AviE3J4duRYoGNXZDGUjiSShXM6AEvHSUJqVnDB96LdY",
  },
];

export { didsFix };