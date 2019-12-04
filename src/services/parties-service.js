const xss = require('xss');

const PartiesService = {
  getAllParties(db, user_id) {
    return db('party')
      .select('*')
      .where('user_id', user_id);
  },
  getPartyById(db, id, user_id) {
    return db('party as p')
      .select('*', 'p.name as party_name')
      .leftJoin('characters AS c', 'c.party_id', 'p.party_id')
      .join(
        'equipment_pack as ep',
        'ep.equipment_pack_id',
        'c.equipment_pack_id'
      )
      .where('p.user_id', user_id)
      .where('c.party_id', id)
  },
  deletePartyById(db, id, user_id) {
    return db('party')
      .select('*')
      .where('party_id', id)
      .where('user_id', user_id)
      .delete();
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
      .then(result => result[0]);
  },
  serializeAllPartyReturn(result) {
    return [
      ...result.map(item => {
        return {
          party_id: item.party_id,
          name: xss(item.name),
        };
      }),
    ];
  },
  serializePartyReturn(result) {
    return {
      party_id: result.party_id,
      name: xss(result.name),
    };
  },
  serializeParty(result) {
    return {
      party_id: result[0].party_id,
      party_name: result[0].party_name,
      characters: [
        ...result.map(char => {
          return {
            char_id: char.char_id,
            char_name: xss(char.name),
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
        }),
      ],
    };
  },
};

module.exports = PartiesService;
