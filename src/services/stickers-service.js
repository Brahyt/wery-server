const StickersService = {
  getAllStickers(db){
    return db
      .select('*')
      .from('stickers')
  }
}

module.exports = StickersService
