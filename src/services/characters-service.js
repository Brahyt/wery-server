const CharactersService = {
  getAllCharacters(db) {
    return db('characters').select('*');
  },
  getCharacterById(db, id) {
    return db('characters')
      .select('*')
      .where('char_id', id)
      .first();
  },
  deleteCharacter(db, id) {
    return db('characters')
      .where('char_id', id)
      .delete();
  },
  updateCharacter(db, id, updatedChar) {
    return db('characters')
      .where('char_id', id)
      .update(updatedChar);
  },
  addCharacter() {},
};

module.exports = CharactersService;
