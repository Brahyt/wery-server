const PartiesService = {
  getAllParties(db) {
    return db('party').select('*');
  },
  getPartyById(db, id) {
    return db('party as p')
      .select(
        '*',
        'p.name as party_name'
      )
      .leftJoin('characters AS c',
        'c.party_id',
        'p.party_id')
      .join('equipment_pack as ep',
        'ep.equipment_pack_id',
        'c.equipment_pack_id')
      .where('c.party_id', id);
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
  createNewParty(db, newParty) {
    return db('party')
      .insert(newParty)
      .returning('*')
      .then(result => result[0])
  },
  serializePartyReturn(result){
    return {
      party_id: result.party_id,
      name: result.name
    }
  },
  serializeParty(result){
    return {
      party_id: result[0].party_id,
      party_name: result[0].party_name,
      characters: [
        ...result.map(char => {
          return {
            char_id: char.char_id,
            char_name: char.name,
            race: char.race,
            class: char.char_class,
            sub_class: char.sub_class,
            xp: char.xp,
            hand_size: char.hand_size,
            health: char.health,
            arcane: char.arcane,
            deception: char.deception,
            martial: char.martial,
            devotion: char.devotion,
          };
        })
      ]
    };
  }
};

module.exports = PartiesService;
