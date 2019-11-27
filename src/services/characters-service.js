// RETURNS CHARACTERS OM USER
const CharactersService = {
  getAllCharacters(db, id) {
    return db('characters')
      .select('*')
      .where('user_id', id)
  },
  getCharacterById(db, user_id) {
    return db('characters AS char')
      .select(
        'char.char_id',
        'char.user_id',
        'char.party_id',
        'char.name',
        'char.race',
        'char.char_class',
        'char.sub_class',
        'char.xp',
        'char.hand_size',
        'char.health',
        'ep.arcane',
        'ep.deception',
        'ep.martial',
        'ep.devotion',
        's1.sticker_title AS s1_title',
        's1.sticker_description AS s1_description',
        's1.sticker_cost AS s1_cost',
        's2.sticker_title AS s2_title',
        's2.sticker_description AS s2_description',
        's2.sticker_cost AS s2_cost',
        's3.sticker_title AS s3_title',
        's3.sticker_description AS s3_description',
        's3.sticker_cost AS s3_cost',
        's4.sticker_title AS s4_title',
        's4.sticker_description AS s4_description',
        's4.sticker_cost AS s4_cost',
        's5.sticker_title AS s5_title',
        's5.sticker_description AS s5_description',
        's5.sticker_cost AS s5_cost',
        's6.sticker_title AS s6_title',
        's6.sticker_description AS s6_description',
        's6.sticker_cost AS s6_cost'
      )
      .join(
        'equipment_pack AS ep',
        'char.equipment_pack_id',
        'ep.equipment_pack_id'
      )
      .join(
        'stickers AS s1',
        'char.sticker_1_id',
        's1.sticker_id'
      )
      .join(
        'stickers AS s2',
        'char.sticker_2_id',
        's2.sticker_id'
      )
      .join(
        'stickers AS s3',
        'char.sticker_3_id',
        's3.sticker_id'
      )
      .join(
        'stickers AS s4',
        'char.sticker_4_id',
        's4.sticker_id'
      )
      .join(
        'stickers AS s5',
        'char.sticker_5_id',
        's5.sticker_id'
      )
      .join(
        'stickers AS s6',
        'char.sticker_6_id',
        's6.sticker_id'
      )
      .where('char_id', user_id)
      .first();
  },
  deleteCharacter(db, id) {
    return db('characters')
      .where('char_id', id)
      .delete();
  },
  updateCharacter(db, char_id, charPayload) {
    //    this.ValidateCharacter(charPayload)
    const newCharPayload = {
      name: charPayload.name,
      race: charPayload.race,
      char_class: charPayload.char_class,
      sub_class: charPayload.sub_class,
      xp: charPayload.xp,
      hand_size: charPayload.hand_size,
      health: charPayload.health,
      party_id: charPayload.party_id,
      user_id: charPayload.user_id,
      sticker_1_id: charPayload.sticker_1_id,
      sticker_2_id: charPayload.sticker_2_id,
      sticker_3_id: charPayload.sticker_3_id,
      sticker_4_id: charPayload.sticker_4_id,
      sticker_5_id: charPayload.sticker_5_id,
      sticker_6_id: charPayload.sticker_6_id
    }
    const epPayload = {
      arcane: charPayload.arcane,
      deception: charPayload.deception,
      martial: charPayload.martial,
      devotion: charPayload.devotion
    }
    return db.transaction(function (trx) {
      return db('equipment_pack')
        .transacting(trx)
        .where("equipment_pack_id", charPayload.equipment_pack_id)
        .update(epPayload)
        .returning("*")
        .then(response => {
          return db('characters')
            .transacting(trx)
            .where("char_id", char_id)
            .update({
              ...newCharPayload,
              equipment_pack_id: response[0].equipment_pack_id
            })
            .returning('*')
            .then(response => {
              return response[0]
            })
        })
    })
  },
  checkCharacterExists(db, id) {
    return db('characters')
      .select('char_id')
      .where('char_id', id)
      .first()
  },
  addCharacter(db, charPayload) {
    this.ValidateCharacter(charPayload)
    const newCharPayload = {
      name: charPayload.name,
      race: charPayload.race,
      char_class: charPayload.char_class,
      sub_class: charPayload.sub_class,
      xp: charPayload.xp,
      hand_size: charPayload.hand_size,
      health: charPayload.health,
      party_id: charPayload.party_id,
      user_id: charPayload.user_id,
      sticker_1_id: charPayload.sticker_1_id,
      sticker_2_id: charPayload.sticker_2_id,
      sticker_3_id: charPayload.sticker_3_id,
      sticker_4_id: charPayload.sticker_4_id,
      sticker_5_id: charPayload.sticker_5_id,
      sticker_6_id: charPayload.sticker_6_id
    }
    const epPayload = {
      arcane: charPayload.arcane,
      deception: charPayload.deception,
      martial: charPayload.martial,
      devotion: charPayload.devotion
    }
    return db.transaction(function (trx) {
      return db('equipment_pack')
        .transacting(trx)
        .insert(epPayload)
        .returning("*")
        .then(response => {
          return db('characters')
            .transacting(trx)
            .insert({
              ...newCharPayload,
              equipment_pack_id: response[0].equipment_pack_id
            })
            .returning('*')
            .then(response => {
              return response[0]
            })
        })
    })
  },
  ValidateCharacter(char, req, res, next){
    if(!char.name) return res.json({error: "You are missing values"})
  },
  SerializeCharacter(result) {
    return {
      char_id: result.char_id,
      user_id: result.user_id,
      party_id: result.party_id,
      name: result.name,
      race: result.race,
      char_class: result.char_class,
      sub_class: result.sub_class,
      xp: result.xp,
      hand_size: result.hand_size,
      health: result.health,
      equipment_pack_id: result.equipment_pack_id,
      equipment: {
        arcane: result.arcane,
        deception: result.deception,
        martial: result.martial,
        devotion: result.devotion
      },
      stickers: [
        {
          title: result.s1_title,
          description: result.s1_description,
          cost: result.s1_cost
        },
        {
          title: result.s2_title,
          description: result.s2_description,
          cost: result.s2_cost
        },
        {
          title: result.s3_title,
          description: result.s3_description,
          cost: result.s3_cost
        },
        {
          title: result.s4_title,
          description: result.s4_description,
          cost: result.s4_cost
        },
        {
          title: result.s5_title,
          description: result.s5_description,
          cost: result.s5_cost
        },
        {
          title: result.s6_title,
          description: result.s6_description,
          cost: result.s6_cost
        },
      ]
    };
  }
};

module.exports = CharactersService;
