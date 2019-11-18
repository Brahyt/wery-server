const PartiesService = {
  getAllParties(db) {
    return db('party').select('*');
  },
  getPartyById(db, id) {
    return db('party')
      .select('*')
      .where('party_id', id);
  },
  deletePartyById(db, id) {
    return db('party')
      .select('*')
      .where('party_id', id);
  },
  updatePartyById(db, id, updatedParty) {
    return db('party')
      .where('party_id', id)
      .update(updatedParty);
  },
  createNewParty() {},
};

module.exports = PartiesService;
