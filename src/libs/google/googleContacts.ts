import google from ".";

export const googleContacts = {
  data: async (params = { id: "", range: "Contatos" }) => {
    return await (
      await google.people.connections.list({
        resourceName: "people/me",
        pageSize: 10,
        personFields: "names,emailAddresses",
      })
    ).data;
  },
};

export default googleContacts;
