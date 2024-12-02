using System.Text;
using System.Text.Json;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using server.Internals.Database;
using server.Internals.Utils;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Security.Cryptography.X509Certificates;

namespace server.Controllers
{
    [ApiController]
    [Route("/")]
    public class BooksController : ControllerBase
    {
        private readonly BookService _bookService;
        public BooksController(BookService bookService) 
        { 
            _bookService = bookService;
        }
        [HttpGet("get-books-genres")]
        public IActionResult FetchBookGenres()
        {
            return Ok(new { genres = Constants.BookGenres });       
        }

        public class BookModel
        {
            [JsonPropertyName("id")]
            public string? Id;
            [JsonPropertyName("title")]
            public string Title { get; set; }
            [JsonPropertyName("genre")]
            public string? Genre { get; set; }
            [JsonPropertyName("author")]
            public string? Author { get; set; }
            [JsonPropertyName("isbn")]
            public string? ISBN { get; set; }
            [JsonPropertyName("publisher")]
            public string? Publisher { get; set; }
            [JsonPropertyName("publication_date")]
            [JsonProperty(PropertyName = "publication_date")]
            public string? PublicationDate { get; set; }
            [JsonPropertyName("language")]
            public string? Language { get; set; }
        }

        [HttpPost("add-book")]
        public async Task<IActionResult> AddBook([FromBody] BookModel model)
        {
            Book book = new Book { 
                Id = Guid.NewGuid(), 
                Author = model.Author, 
                Genre = model.Genre, 
                ISBN = model.ISBN,
                Language = model.Language, 
                PublicationDate = model.PublicationDate != null ? DateTime.ParseExact(model.PublicationDate, "dd-MM-yyyy", 
                        System.Globalization.CultureInfo.InvariantCulture) : null, 
                Publisher = model.Publisher, 
                Title = model.Title 
            };
            ErrorCodes result = await _bookService.AddBook(book);
            if (result == ErrorCodes.SQLError)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Internal server error" });
            }
            return StatusCode(StatusCodes.Status201Created, book);
        }
        [HttpGet("get-books")]
        public async Task<IActionResult> GetBooks()
        {
             return Ok(_bookService.GetBooks());
        }
        public class DeleteBookModel
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }
        }
        [HttpDelete("delete-book")]
        public async Task<IActionResult> DeleteBook([FromBody] DeleteBookModel model)
        {
            var guid = Guid.Parse(model.Id);
            await _bookService.DeleteBookByID(guid);
            return StatusCode(StatusCodes.Status204NoContent);
        }
        [HttpPost("update-book")]
        public async Task<IActionResult> UpdateBook()
        {
            string body = "";
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8)) 
            {
                body = await reader.ReadToEndAsync();
            }
            BookModel model = JsonConvert.DeserializeObject<BookModel>(body)!;
            Book book = new Book { 
                Id = Guid.Parse(model.Id!), 
                Author = model.Author, 
                Genre = model.Genre, 
                ISBN = model.ISBN,
                Language = model.Language, 
                PublicationDate = model.PublicationDate != null ? DateTime.ParseExact(model.PublicationDate, "dd-MM-yyyy", 
                        System.Globalization.CultureInfo.InvariantCulture) : null, 
                Publisher = model.Publisher, 
                Title = model.Title 
            };
            await _bookService.UpdateBook(book);
            return Ok();
        }
    }
}
