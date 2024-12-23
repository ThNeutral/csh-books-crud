﻿using server.Internals.Utils;

namespace server.Internals.Database
{
    public class BookService
    {
        private DatabaseContext _dbContext;
        public BookService(DatabaseContext dbContext) 
        {
            _dbContext = dbContext;
        }
        public async Task AddBook(Book book) 
        {
            _dbContext.Books.Add(book);
            await _dbContext.SaveChangesAsync();
        }
        public List<Book> GetBooks()
        {
            return [.. _dbContext.Books];
        }
        public async Task<ErrorCodes> DeleteBookByID(Guid id)
        {
            try
            {
                var book = _dbContext.Books.FirstOrDefault(x => x.Id == id);
                if (book == null)
                {
                    return ErrorCodes.NoError;
                }
                _dbContext.Books.Remove(book);
                await _dbContext.SaveChangesAsync();
                return ErrorCodes.NoError;
            }
            catch (Exception ex) 
            {
                return ErrorCodes.SQLError;
            }
        }
        public async Task UpdateBook(Book book) {
            _dbContext.Update(book);
            await _dbContext.SaveChangesAsync();
        }
    }
}
