// eslint-disable-next-line no-undef
const port = process.env.PORT ? Number(process.env.PORT) : 3001;
// eslint-disable-next-line no-undef
const endpoint = process.env.ENDPOINT ?? `http://127.0.0.1:${port}`;
const config = {
  endpoint: endpoint,
  endpoints: [endpoint],
  port,
  path: {
    ping: "/ping",
    getConnectionByDid: "/getConnectionByDid",
    invitation: "/invitation",
    credential: "/credential",
    invitationWithCredential: "/offerCredentialWithConnection",
    invitationWithCredentialConnectionless:
      "/offerCredentialWithConnectionLess",
    shorten: "/shorten/:id",
    createShorten: "/shorten",
    credentials: {
      summit: "/credentials/schemas/summit/v1",
    },
    keriOobi: "/keriOobi",
    issueAcdcCredentialWithOobi : "/issueAcdcCredentialWithOobi",
    schemaOobi: "/oobi/:id",
  },
};

export { config };
