TRUNCATE TABLE equipment_pack CASCADE;
ALTER SEQUENCE equipment_pack_equipment_pack_id_seq RESTART WITH 1;
TRUNCATE TABLE characters CASCADE;
ALTER SEQUENCE characters_char_id_seq RESTART WITH 1;
TRUNCATE TABLE party CASCADE;
ALTER SEQUENCE party_party_id_seq RESTART WITH 1;
TRUNCATE TABLE users CASCADE;
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
INSERT INTO equipment_pack(arcane, deception, martial, devotion) VALUES(1, 2, 3, 4);
INSERT INTO users(user_email, user_password) VALUES ('hey@hello.com', '123456');
INSERT INTO party(name) VALUES('Cool party');
INSERT INTO characters(name, race, char_class, sub_class, xp, hand_size, health, party_id, user_id, sticker_1_id, sticker_2_id, sticker_3_id, sticker_4_id, sticker_5_id, sticker_6_id, equipment_pack_id) VALUES('Opha', 'Human', 'Martial', 'Fighter', 5, 6, 10, 1, 1, 1, 2, 3, 4, 5, 6, 1)
;
